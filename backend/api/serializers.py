from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Habit, HabitEntry, BreathingSession, QuizAttempt


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    level_name = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'bio', 'objective',
            'pixela_username', 'pixela_token', 'pixela_graph_id',
            'level', 'level_name', 'sessions_completed',
            'time_invested', 'current_streak', 'avatar_style',
        ]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    objective = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def create(self, validated_data):
        objective = validated_data.pop('objective', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        UserProfile.objects.create(user=user, objective=objective)
        return user


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'category',
            'emoji', 'icon_color', 'is_active', 'order', 'created_at',
        ]
        read_only_fields = ['created_at']


class HabitEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitEntry
        fields = ['id', 'habit', 'date', 'completed']


class BreathingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreathingSession
        fields = ['id', 'duration_seconds', 'elapsed_seconds', 'completed', 'created_at']
        read_only_fields = ['created_at']


class QuizAttemptSerializer(serializers.ModelSerializer):
    score_percent = serializers.ReadOnlyField()

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'category_id', 'category_name',
            'total_questions', 'correct_answers', 'score_percent', 'created_at',
        ]
        read_only_fields = ['created_at']
