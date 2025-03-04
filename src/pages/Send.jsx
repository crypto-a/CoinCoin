// src/pages/Send.jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../db'
import { useNavigate } from 'react-router-dom'
import { FiSend, FiCamera } from 'react-icons/fi'

export default function Send() {
    const { user } = useAuth()
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleSend = async (e) => {
        e.preventDefault()
        if (!recipient || !amount) return

        // Get current user's balance
        const { data: userData, error: userError } = await db
            .from('user')
            .select('coins')
            .eq('id', user.id)
            .single()
        if (userError) {
            setMessage('Error fetching balance')
            return
        }
        const coinBalance = userData.coins

        if (Number(amount) > coinBalance) {
            setMessage('Insufficient coins')
            return
        }

        // Find recipient by email (stored as username)
        const { data: recipientData, error } = await db
            .from('user')
            .select('id, coins')
            .eq('username', recipient)
            .single()

        if (error || !recipientData) {
            setMessage('Recipient not found')
            return
        }

        const newSenderBalance = coinBalance - Number(amount)
        const newRecipientBalance = recipientData.coins + Number(amount)

        // Update sender's balance
        const { error: updateSenderError } = await db
            .from('user')
            .update({ coins: newSenderBalance })
            .eq('id', user.id)
        if (updateSenderError) {
            setMessage('Error updating sender balance')
            return
        }

        // Update recipient's balance
        const { error: updateRecipientError } = await db
            .from('user')
            .update({ coins: newRecipientBalance })
            .eq('id', recipientData.id)
        if (updateRecipientError) {
            setMessage('Error updating recipient balance')
            return
        }

        // Log the transfer in the "transfers" table.
        const { error: logError } = await db.from('transfers').insert([
            { sender_id: user.id, recipient_id: recipientData.id, amount: Number(amount) },
        ])
        if (logError) {
            setMessage('Error logging transfer')
            return
        }
        setMessage('Transfer successful')
        // Optionally, navigate back to the dashboard:
        // navigate('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiSend /> Send Tokens
            </h1>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            <form onSubmit={handleSend} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block mb-2">Recipient Email</label>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Recipient email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                        <button
                            type="button"
                            className="ml-2 p-2 border rounded"
                            onClick={() => {
                                /* Implement QR scanning functionality here */
                            }}
                        >
                            <FiCamera />
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Amount</label>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
                    Send
                </button>
            </form>
        </div>
    )
}
