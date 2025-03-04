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

        // 1) Sign up the user via Supabase Auth
        const { data, error: signupError } = await db.auth.signUp({
            email,
            password
        })

        if (signupError) {
            setError(signupError.message)
            return
        }

        // The Supabase Auth signUp response is in "data.user"
        // If signUp succeeded:
        const newUser = data.user
        if (!newUser) {
            setError('No user returned from signUp.')
            return
        }

        try {
            // 2) Create a new wallet row with `amount: 0`
            const { error: walletError } = await db
                .from('wallet')
                .insert([{
                    user: newUser.id,  // or store user email if you prefer
                    amount: 0
                }])
            if (walletError) {
                setError(walletError.message)
                return
            }

            // 3) (Optional) Insert into some "user" table if you want
            //    (If you no longer need the "user" table for coins, you can skip or adapt.)
            //    Example:
            // const { error: userTableError } = await db.from('user').insert([
            //   { id: newUser.id, username: newUser.email, coins: 0 }
            // ])
            // if (userTableError) {
            //   setError(userTableError.message)
            //   return
            // }

            // If everything is good, navigate to dashboard
            navigate('/dashboard')

        } catch (err) {
            console.error(err)
            setError('Unexpected error creating wallet.')
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

                <button
                    type="submit"
                    className="bg-green-500 text-white w-full py-2 rounded"
                >
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
