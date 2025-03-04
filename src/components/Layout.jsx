// src/components/Layout.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top Bar / Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <Link to="/">
                    <h1 className="text-2xl font-bold text-blue-600">
                        CoinCoin
                    </h1>
                </Link>

                <nav className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-blue-600 font-semibold">
                                Dashboard
                            </Link>
                            {/* You could add a logout button here if you wish */}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-blue-600 font-semibold">
                                Login
                            </Link>
                            <Link to="/register" className="text-blue-600 font-semibold">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4">{children}</main>

            {/* Footer or Bottom Bar if you want */}
        </div>
    )
}
