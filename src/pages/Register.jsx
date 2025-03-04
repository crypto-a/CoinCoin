// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { db } from '../db'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        const { user, error } = await db.auth.signUp({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            // After signing up, insert the new user into the custom table.
            // You can set a default coin value (e.g. 100) and use the email as username.
            const { error: insertError } = await db.from('user').insert([
                { id: user.id, username: user.email, coins: 100 },
            ])
            if (insertError) {
                setError(insertError.message)
                return
            }
            navigate('/dashboard')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleRegister}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">Register</h2>
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
                <button type="submit" className="bg-green-500 text-white w-full py-2 rounded">
                    Register
                </button>
            </form>
            <p className="mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500">
                    Login
                </Link>
            </p>
        </div>
    )
}
