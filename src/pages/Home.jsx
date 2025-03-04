// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { FaCoins } from 'react-icons/fa'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2">Welcome to CoinCoin</h1>
                <p className="text-xl">Brought to you by CoinCoin Productions</p>
                <FaCoins size={48} className="mx-auto mt-4" />
            </div>
            <h2 className="text-2xl font-bold mb-6">Register and Start Trading Now</h2>
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
