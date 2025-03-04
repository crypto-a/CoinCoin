import { useWallet } from '../contexts/WalletContext'
import { Link } from 'react-router-dom'
import { FiSend, FiDownload, FiList } from 'react-icons/fi'

export default function Dashboard() {
    const { wallet } = useWallet()

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* If wallet is still loading or missing, show 0 or a loading state */}
            <p className="mb-4">
                Your coin balance:{' '}
                <span className="font-bold">
          {wallet ? wallet.amount : '0'}
        </span>
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
        </div>
    )
}
