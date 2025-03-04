// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../db'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await db.auth.getSession()
            setUser(session?.user ?? null)
        }
        getSession()

        const { data: { subscription } } = db.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
