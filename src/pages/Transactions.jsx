import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../db'
import { FiList } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function Transactions() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return

        const fetchTransactions = async () => {
            // We want all rows where either `from = user.id` or `to = user.id`.
            const { data, error } = await db
                .from('transfers')
                .select('*')
                .or(`from.eq.${user.id},to.eq.${user.id}`)  // <-- important
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setTransactions(data)
            }
        }

        fetchTransactions()
    }, [user])

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-purple-50">
            {/* Back Button if you want */}
            <div className="self-start mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-purple-600"
                >
                    <FiArrowLeft className="mr-1 text-2xl" />
                    <span className="text-sm">Back</span>
                </button>
            </div>

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
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx) => {
                            // if tx.from === user.id => 'Sent'
                            // if tx.to === user.id => 'Received'
                            const type = tx.from === user.id ? 'Sent' : 'Received'
                            return (
                                <tr key={tx.id}>
                                    <td className="border px-4 py-2">{type}</td>
                                    <td className="border px-4 py-2">{tx.amount}</td>
                                    <td className="border px-4 py-2">
                                        {tx.created_at
                                            ? new Date(tx.created_at).toLocaleString()
                                            : 'N/A'}
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
