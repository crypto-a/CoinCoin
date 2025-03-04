// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { db } from '../db'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const { error, user } = await db.auth.signIn({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500">
                    Register
                </Link>
            </p>
        </div>
    )
}
