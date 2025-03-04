// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Send from './pages/Send'
import Receive from './pages/Receive'
import Transactions from './pages/Transactions'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/send" element={<Send />} />
                    <Route path="/dashboard/receive" element={<Receive />} />
                    <Route path="/dashboard/transactions" element={<Transactions />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
