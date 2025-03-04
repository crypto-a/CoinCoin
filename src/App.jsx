// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WalletProvider } from './contexts/WalletContext'
import Layout from './components/Layout'  // <--- new
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
            <WalletProvider>
                <Router>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <Layout>
                                    <Login />
                                </Layout>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <Layout>
                                    <Register />
                                </Layout>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            }
                        />
                        <Route
                            path="/dashboard/send"
                            element={
                                <Layout>
                                    <Send />
                                </Layout>
                            }
                        />
                        <Route
                            path="/dashboard/receive"
                            element={
                                <Layout>
                                    <Receive />
                                </Layout>
                            }
                        />
                        <Route
                            path="/dashboard/transactions"
                            element={
                                <Layout>
                                    <Transactions />
                                </Layout>
                            }
                        />
                    </Routes>
                </Router>
            </WalletProvider>
        </AuthProvider>
    )
}

export default App
