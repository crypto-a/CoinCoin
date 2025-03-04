// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { db } from '../db'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { FiSend, FiDownload, FiList } from 'react-icons/fi'

export default function Dashboard() {
    const { user } = useAuth()
    const [coinBalance, setCoinBalance] = useState(0)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchUserCoins = async () => {
            if (user) {
                // Fetch the coin balance from your custom "user" table.
                const { data, error } = await db
                    .from('user')
                    .select('coins')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.error(error)
                } else {
                    setCoinBalance(data.coins)
                }
            }
        }
        fetchUserCoins()
    }, [user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">
                Your coin balance: <span className="font-bold">{coinBalance}</span>
            </p>
            <div className="flex space-x-4 mb-4">
                <Link
                    to="/dashboard/send"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FiSend /> Send
                </Link>
                <Link
                    to="/dashboard/receive"
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FiDownload /> Receive
                </Link>
                <Link
                    to="/dashboard/transactions"
                    className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FiList /> Transactions
                </Link>
            </div>
            {message && <p>{message}</p>}
        </div>
    )
}
