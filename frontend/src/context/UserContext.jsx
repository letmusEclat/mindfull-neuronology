import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      client.get('/profile/').then(({ data }) => {
        setProfile(data)
      }).catch(() => {
        localStorage.clear()
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const { data } = await client.post('/auth/login/', { username, password })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    const { data: prof } = await client.get('/profile/')
    setProfile(prof)
    setUser({ username })
    return prof
  }

  const register = async (username, email, password, objective) => {
    const { data } = await client.post('/auth/register/', { username, email, password, objective })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    const { data: prof } = await client.get('/profile/')
    setProfile(prof)
    setUser({ username })
    return prof
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    const { data } = await client.get('/profile/')
    setProfile(data)
  }

  return (
    <UserContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
