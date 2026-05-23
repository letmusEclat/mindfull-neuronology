from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta

import requests
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, Habit, HabitEntry, BreathingSession, QuizAttempt
from .serializers import (
    UserProfileSerializer, RegisterSerializer,
    HabitSerializer, HabitEntrySerializer,
    BreathingSessionSerializer, QuizAttemptSerializer,
)


# ── Auth ────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Profile ─────────────────────────────────────────────────────────────────

class ProfileView(APIView):
    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Habits ───────────────────────────────────────────────────────────────────

class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)


@api_view(['GET', 'POST'])
def habit_entries_today(request):
    """Get or bulk-set today's habit entries."""
    today = date.today()

    if request.method == 'GET':
        habits = Habit.objects.filter(user=request.user, is_active=True)
        entries = HabitEntry.objects.filter(habit__user=request.user, date=today)
        entry_map = {e.habit_id: e.completed for e in entries}
        data = []
        for h in habits:
            data.append({
                'habit_id': h.id,
                'name': h.name,
                'description': h.description,
                'category': h.category,
                'emoji': h.emoji,
                'icon_color': h.icon_color,
                'completed': entry_map.get(h.id, False),
            })
        return Response(data)

    if request.method == 'POST':
        habit_id = request.data.get('habit_id')
        completed = request.data.get('completed', False)
        habit = Habit.objects.filter(id=habit_id, user=request.user).first()
        if not habit:
            return Response({'error': 'Habit not found.'}, status=404)
        entry, _ = HabitEntry.objects.get_or_create(habit=habit, date=today)
        entry.completed = completed
        entry.save()
        return Response(HabitEntrySerializer(entry).data)


@api_view(['GET'])
def habit_heatmap(request):
    """Return days with completed habits in the last 56 days plus today."""
    today = date.today()
    start = today - timedelta(days=55)
    entries = HabitEntry.objects.filter(
        habit__user=request.user,
        date__gte=start,
        completed=True,
    ).values('date')

    counts = {}
    for e in entries:
        d = e['date'].isoformat()
        counts[d] = counts.get(d, 0) + 1

    total_habits = Habit.objects.filter(user=request.user, is_active=True).count() or 1
    result = []
    current = start
    while current <= today:
        iso = current.isoformat()
        day_count = counts.get(iso, 0)
        if day_count > 0 or current == today:
            result.append({'date': iso, 'count': day_count, 'total': total_habits})
        current += timedelta(days=1)
    return Response(result)


# ── Breathing ────────────────────────────────────────────────────────────────

class BreathingSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = BreathingSessionSerializer

    def get_queryset(self):
        return BreathingSession.objects.filter(user=self.request.user).order_by('-created_at')[:20]

    def perform_create(self, serializer):
        session = serializer.save(user=self.request.user)
        if session.completed:
            profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
            profile.sessions_completed += 1
            profile.time_invested += session.duration_seconds // 60
            profile.save()


# ── Quiz ─────────────────────────────────────────────────────────────────────

class QuizAttemptListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizAttemptSerializer

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-created_at')[:50]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ── Pixela Proxy ──────────────────────────────────────────────────────────────

@api_view(['POST'])
def pixela_post_pixel(request):
    """Proxy a Pixela pixel POST to avoid exposing the token on the frontend."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if not profile.pixela_username or not profile.pixela_token:
        return Response({'error': 'Pixela not configured.'}, status=400)

    pixel_date = request.data.get('date', date.today().strftime('%Y%m%d'))
    quantity = str(request.data.get('quantity', '1'))
    graph_id = profile.pixela_graph_id or 'mindful-neuron'

    pixels_url = f'https://pixe.la/v1/users/{profile.pixela_username}/graphs/{graph_id}/pixels'
    pixel_url = f'{pixels_url}/{pixel_date}'
    headers = {'X-USER-TOKEN': profile.pixela_token}
    payload = {'date': pixel_date, 'quantity': quantity}

    try:
        quantity_int = int(quantity)

        # No completed habits for the day: remove pixel if it exists.
        if quantity_int <= 0:
            resp = requests.delete(pixel_url, headers=headers, timeout=10)
            return Response(resp.json(), status=resp.status_code)

        # First try to create pixel in /pixels endpoint.
        create_resp = requests.post(pixels_url, json=payload, headers=headers, timeout=10)
        create_json = create_resp.json()

        # If the pixel already exists, update it with PUT /pixels/{date}.
        if not create_json.get('isSuccess', False):
            update_resp = requests.put(pixel_url, json={'quantity': quantity}, headers=headers, timeout=10)
            return Response(update_resp.json(), status=update_resp.status_code)

        return Response(create_json, status=create_resp.status_code)
    except ValueError:
        return Response({'error': 'Quantity must be a valid integer string.'}, status=400)
    except requests.RequestException as e:
        return Response({'error': str(e)}, status=502)
