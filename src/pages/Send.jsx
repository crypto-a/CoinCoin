import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../db'
import { useNavigate } from 'react-router-dom'
import { FiSend, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { useWallet } from '../contexts/WalletContext'
import {QrReader} from "react-qr-reader";


export default function Send() {
    const { user } = useAuth()
    const { wallet, updateWalletAmount, logTransfer } = useWallet()
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const [showScanner, setShowScanner] = useState(false) // <-- toggles camera on/off
    const navigate = useNavigate()

    const handleScan = (data) => {
        if (data) {
            // data is the text from QR code
            setRecipient(data)
            setShowScanner(false) // hide scanner once we have data
        }
    }

    const handleError = (err) => {
        console.error(err)
        setShowScanner(false)
        setMessage('Error accessing camera or scanning code.')
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!recipient || !amount) return

        // 1. Check sender's wallet:
        const senderAmount = wallet?.amount || 0
        if (Number(amount) > senderAmount) {
            setMessage('Insufficient funds')
            return
        }

        // 2. Find recipient wallet by user ID (which we store as a string).
        //    If your QR code is an email, you might need to convert email -> user ID.
        //    If your QR code is just the user ID, then you do eq('user', recipient).
        //    Adjust as needed if you store emails in the wallet table, or do a lookup first.
        const { data: recipientWallet, error: recipientError } = await db
            .from('wallet')
            .select('*')
            .eq('user', recipient)
            .single()

        if (recipientError || !recipientWallet) {
            setMessage('Recipient wallet not found')
            return
        }

        // 3. Update wallets
        const newSenderAmount = senderAmount - Number(amount)
        const newRecipientAmount = recipientWallet.amount + Number(amount)

        const senderUpdate = await updateWalletAmount(newSenderAmount)
        if (!senderUpdate) {
            setMessage('Error updating sender wallet')
            return
        }

        const { error: recipientUpdateError } = await db
            .from('wallet')
            .update({ amount: newRecipientAmount })
            .eq('user', recipientWallet.user)

        if (recipientUpdateError) {
            setMessage('Error updating recipient wallet')
            return
        }

        // 4. Log the transfer
        const transfer = {
            amount: Number(amount),
            from: user.id,
            to: recipientWallet.user
        }
        const transferLog = await logTransfer(transfer)
        if (!transferLog) {
            setMessage('Error logging transfer')
            return
        }

        setMessage('Transfer successful!')
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
            {/* Back Button */}
            <div className="self-start mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600"
                >
                    <FiArrowLeft className="mr-1 text-2xl" />
                    <span className="text-sm">Back</span>
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiSend /> Send Tokens
            </h1>

            {message && (
                <p className="mb-4 text-center font-semibold text-red-600">{message}</p>
            )}

            <form
                onSubmit={handleSend}
                className="bg-white p-6 rounded shadow-md w-full max-w-md"
            >
                <div className="mb-4">
                    <label className="block mb-2">Recipient User ID or Email</label>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Scan or type recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                        <button
                            type="button"
                            className="ml-2 p-2 border rounded"
                            onClick={() => setShowScanner(true)}
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

                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full py-2 rounded"
                >
                    Send
                </button>
            </form>

            {/* Camera / QR Scanner Modal */}
            {showScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-md">
                        <p className="text-center mb-4 font-semibold">Scan QR Code</p>
                        <QrReader
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '300px' }}
                        />
                        <button
                            onClick={() => setShowScanner(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
