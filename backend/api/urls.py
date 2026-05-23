from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),

    # Habits
    path('habits/', views.HabitListCreateView.as_view(), name='habit-list'),
    path('habits/<int:pk>/', views.HabitDetailView.as_view(), name='habit-detail'),
    path('habits/today/', views.habit_entries_today, name='habit-today'),
    path('habits/heatmap/', views.habit_heatmap, name='habit-heatmap'),

    # Breathing
    path('breathing/', views.BreathingSessionListCreateView.as_view(), name='breathing-list'),

    # Quiz
    path('quiz/', views.QuizAttemptListCreateView.as_view(), name='quiz-list'),

    # Pixela proxy
    path('pixela/pixel/', views.pixela_post_pixel, name='pixela-pixel'),
]
