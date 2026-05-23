from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    LEVEL_NAMES = {
        1: 'Nascent Synapse',
        2: 'Neural Seedling',
        3: 'Synaptic Sprout',
        4: 'Dendrite Weaver',
        5: 'Axon Pioneer',
    }

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.CharField(max_length=300, default='Dedicated neuroplasticity student')
    objective = models.TextField(blank=True, default='')
    pixela_username = models.CharField(max_length=100, blank=True)
    pixela_token = models.CharField(max_length=200, blank=True)
    pixela_graph_id = models.CharField(max_length=100, blank=True, default='mindful-neuron')
    level = models.PositiveIntegerField(default=1)
    sessions_completed = models.PositiveIntegerField(default=0)
    time_invested = models.PositiveIntegerField(default=0)  # minutes
    current_streak = models.PositiveIntegerField(default=0)
    avatar_style = models.CharField(max_length=20, default='breathe')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def level_name(self):
        return self.LEVEL_NAMES.get(self.level, 'Neural Master')

    def __str__(self):
        return f'{self.user.username} – L{self.level}'


class Habit(models.Model):
    CATEGORY_CHOICES = [
        ('nutrition', 'Nutrition'),
        ('exercise', 'Exercise'),
        ('growth', 'Growth'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    emoji = models.CharField(max_length=10, blank=True, default='✨')
    icon_color = models.CharField(max_length=10, blank=True, default='#facd3b')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f'{self.name} ({self.user.username})'


class HabitEntry(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ['habit', 'date']
        ordering = ['-date']

    def __str__(self):
        return f'{self.habit.name} – {self.date} – {"✓" if self.completed else "✗"}'


class BreathingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='breathing_sessions')
    duration_seconds = models.PositiveIntegerField()  # total session length
    elapsed_seconds = models.PositiveIntegerField(default=0)  # how long they stayed
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} – {self.duration_seconds}s – {self.created_at.date()}'


class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    category_id = models.PositiveIntegerField()
    category_name = models.CharField(max_length=100)
    total_questions = models.PositiveIntegerField()
    correct_answers = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def score_percent(self):
        if self.total_questions == 0:
            return 0
        return round(self.correct_answers / self.total_questions * 100)

    def __str__(self):
        return f'{self.user.username} – {self.category_name} – {self.score_percent}%'
