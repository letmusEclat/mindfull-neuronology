# Mindful Neuron 🧠

A modern, calming neuroplasticity awareness app built with **React + Vite** (frontend) and **Django REST Framework** (backend).

## Features

| Screen | Description |
|---|---|
| **Brain Gym** | Trivia quizzes fetched live from [Open Trivia DB](https://opentdb.com/) — Science, Logic, Geography, and more. |
| **Mindful Breathing** | Animated neuron aura session with a countdown timer, breathing rhythm animations, and session tracking. |
| **Good Habits** | Daily habit toggles (Nutrition, Exercise, Growth) with a **Neural Garden** heatmap powered by your habit history and [Pixela API](https://pixe.la/). |
| **Profile** | Streak data, sessions completed, focus objective, level system, and Pixela configuration. |

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios  
- **Backend**: Django 5, Django REST Framework, SimpleJWT, django-cors-headers  
- **External APIs**: [Open Trivia DB](https://opentdb.com/api_config.php), [Pixela](https://pixe.la/)  
- **Font**: Poppins (Google Fonts)  
- **Design System**: Lumina — warm golden palette with rounded UI elements

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install Django djangorestframework django-cors-headers djangorestframework-simplejwt requests

python manage.py migrate
python manage.py createsuperuser   # optional admin access
python manage.py runserver         # → http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # → http://localhost:5173
```

> Open http://localhost:5173 in a mobile-sized browser window (375–430px wide).

---

## Pixela (Neural Garden) Setup

1. Create a free account at https://pixe.la/
2. Note your **username** and **token**.
3. Create a graph via the Pixela dashboard (graph ID, e.g. `mindful-neuron`).
4. In the app, go to **Profile → Edit** and enter your Pixela credentials.

Habit completions are automatically synced to your Pixela graph via the Django proxy endpoint (`/api/pixela/pixel/`), so your token stays server-side.

---

## Project Structure

```
parcial react/
├── frontend/               # Vite + React app
│   └── src/
│       ├── api/            # Axios client (JWT auto-refresh)
│       ├── components/     # BottomNav, NeuronAvatar, SpeechBubble, HeatmapGrid
│       ├── context/        # UserContext (auth state)
│       └── pages/          # BrainGym, MindfulBreathing, GoodHabits, Profile, Auth
└── backend/                # Django project
    ├── config/             # settings, urls, wsgi
    └── api/                # models, serializers, views, urls
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Get JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET/PATCH | `/api/profile/` | Get / update profile |
| GET/POST | `/api/habits/` | List / create habits |
| GET/POST | `/api/habits/today/` | Today's habit states |
| GET | `/api/habits/heatmap/` | 56-day heatmap data |
| GET/POST | `/api/breathing/` | Breathing sessions |
| GET/POST | `/api/quiz/` | Quiz attempts |
| POST | `/api/pixela/pixel/` | Post pixel to Pixela (proxy) |
