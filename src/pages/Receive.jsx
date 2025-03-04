//src/pages/Receive.jsx
import { useAuth } from '../contexts/AuthContext'
import { FiDownload, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode-generator'

export default function Receive() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const email = user ? user.email : '';

    // Create QR code using qrcode-generator
    const qr = QRCode(0, 'L'); // Version 0, Error correction level L
    qr.addData(email);
    qr.make();

    // Generate SVG string
    const qrSvg = qr.createSvgTag({ cellSize: 8, margin: 2 });

    return (
        <div className="flex flex-col items-center min-h-screen bg-green-50 p-4">
            {/* Back Button */}
            <div className="self-start mb-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-green-700">
                    <FiArrowLeft className="mr-1 text-2xl" />
                    <span className="text-sm">Back</span>
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiDownload /> Receive Tokens
            </h1>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                <p className="mb-4">Your Email:</p>
                <p className="mb-4 font-bold">{email || 'Not logged in'}</p>
                <p className="mb-4">Share this QR code with others to receive tokens</p>
                <div className="border p-4 inline-block">
                    <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                    <p className="mt-2 text-sm">Scan to get my email</p>
                </div>
            </div>
        </div>
    )
}
