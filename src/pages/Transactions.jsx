// src/pages/Transactions.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../db'
import { FiList } from 'react-icons/fi'

export default function Transactions() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if (!user) return
        const fetchTransactions = async () => {
            const { data, error } = await db
                .from('transfers')
                .select('*')
                .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            if (error) {
                console.error(error)
            } else {
                setTransactions(data)
            }
        }
        fetchTransactions()
    }, [user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 p-4">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiList /> Transactions
            </h1>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                {transactions.length === 0 ? (
                    <p>No transactions found.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx) => {
                            const type = tx.sender_id === user.id ? 'Sent' : 'Received'
                            return (
                                <tr key={tx.id}>
                                    <td className="border px-4 py-2">{type}</td>
                                    <td className="border px-4 py-2">{tx.amount}</td>
                                    <td className="border px-4 py-2">
                                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
