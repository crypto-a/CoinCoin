// src/pages/Home.jsx
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Register and Start Trading Now
            </h1>
            <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">
                    Register
                </Link>
            </div>
        </div>
    )
}
