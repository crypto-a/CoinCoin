// src/pages/Receive.jsx
import { useAuth } from '../contexts/AuthContext'
import { FiDownload, FiCamera } from 'react-icons/fi'

export default function Receive() {
    const { user } = useAuth()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiDownload /> Receive Tokens
            </h1>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                <p className="mb-4">Your Email:</p>
                <p className="mb-4 font-bold">{user ? user.email : 'Not logged in'}</p>
                <p className="mb-4">Share this QR code with others to receive tokens</p>
                {/* Replace this placeholder with an actual QR code component as needed */}
                <div className="border p-4 inline-block">
                    <FiCamera size={48} />
                    <p className="mt-2">QR Code Placeholder</p>
                </div>
            </div>
        </div>
    )
}
