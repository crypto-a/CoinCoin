// src/contexts/WalletContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../db';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);

    // Fetch the wallet record for the logged-in user
    const fetchWallet = async () => {
        if (user) {
            const { data, error } = await db
                .from('wallet')
                .select('*')
                .eq('user', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching wallet:', error);
            } else if (!data) {
                console.warn('No wallet record found for this user.');
            } else {
                setWallet(data);
            }
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [user]);

    // Update the wallet amount for the current user
    const updateWalletAmount = async (newAmount) => {
        const { data, error } = await db
            .from('wallet')
            .update({ amount: newAmount })
            .eq('user', user.id);
        if (error) {
            console.error('Error updating wallet:', error);
            return null;
        } else {
            setWallet(data[0]);
            return data[0];
        }
    };

    // Log a transfer by inserting a record into the transfers table.
    // Expects an object: { amount, from, to }
    const logTransfer = async (transfer) => {
        const { data, error } = await db.from('transfers').insert([transfer]);
        if (error) {
            console.error('Error logging transfer:', error);
            return null;
        } else {
            return data[0];
        }
    };

    return (
        <WalletContext.Provider
            value={{
                wallet,
                fetchWallet,
                updateWalletAmount,
                logTransfer,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
