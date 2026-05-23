from django.contrib import admin
from .models import UserProfile, Habit, HabitEntry, BreathingSession, QuizAttempt

admin.site.register(UserProfile)
admin.site.register(Habit)
admin.site.register(HabitEntry)
admin.site.register(BreathingSession)
admin.site.register(QuizAttempt)
