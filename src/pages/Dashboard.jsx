// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { db } from '../db'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()
    const [coinBalance, setCoinBalance] = useState(0)
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
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

    const handleSend = async (e) => {
        e.preventDefault()
        if (!recipient || !amount) return

        if (Number(amount) > coinBalance) {
            setMessage('Insufficient coins')
            return
        }

        // Find recipient by username.
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

        // Update sender's balance.
        const { error: updateSenderError } = await db
            .from('user')
            .update({ coins: newSenderBalance })
            .eq('id', user.id)
        if (updateSenderError) {
            setMessage('Error updating sender balance')
            return
        }

        // Update recipient's balance.
        const { error: updateRecipientError } = await db
            .from('user')
            .update({ coins: newRecipientBalance })
            .eq('id', recipientData.id)
        if (updateRecipientError) {
            setMessage('Error updating recipient balance')
            return
        }

        // Log the transfer in a "transfers" table.
        const { error: logError } = await db.from('transfers').insert([
            { sender_id: user.id, recipient_id: recipientData.id, amount: Number(amount) },
        ])
        if (logError) {
            setMessage('Error logging transfer')
            return
        }

        setCoinBalance(newSenderBalance)
        setMessage('Transfer successful')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">
                Your coin balance:{' '}
                <span className="font-bold">{coinBalance}</span>
            </p>
            <div className="flex space-x-4 mb-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Receive</button>
            </div>
            <form
                onSubmit={handleSend}
                className="bg-white p-4 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">Send Tokens</h2>
                {message && <p className="mb-4">{message}</p>}
                <input
                    type="text"
                    placeholder="Recipient username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
                    Send Tokens
                </button>
            </form>
        </div>
    )
}
