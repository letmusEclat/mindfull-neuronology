import { NavLink } from 'react-router-dom'
import { FiActivity, FiCheckCircle, FiUser, FiWind } from 'react-icons/fi'

const tabs = [
  {
    to: '/gym',
    label: 'Gimnasio',
    icon: FiActivity,
  },
  {
    to: '/breathe',
    label: 'Respirar',
    icon: FiWind,
  },
  {
    to: '/habits',
    label: 'Hábitos',
    icon: FiCheckCircle,
  },
  {
    to: '/profile',
    label: 'Perfil',
    icon: FiUser,
  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-outline-variant z-50 flex justify-around items-center px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all text-xs font-semibold ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          <tab.icon className="w-6 h-6" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
