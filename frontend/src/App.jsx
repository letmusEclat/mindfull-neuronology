import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import BottomNav from './components/BottomNav'
import BrainGym from './pages/BrainGym'
import MindfulBreathing from './pages/MindfulBreathing'
import GoodHabits from './pages/GoodHabits'
import Profile from './pages/Profile'

function AppRoutes() {
  const { loading } = useUser()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface gap-4">
        <div className="w-10 h-10 border-4 border-primary-container border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-medium">Cargando tu espacio mental...</p>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/gym" replace />} />
        <Route path="/gym" element={<BrainGym />} />
        <Route path="/breathe" element={<MindfulBreathing />} />
        <Route path="/habits" element={<GoodHabits />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/gym" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  )
}
