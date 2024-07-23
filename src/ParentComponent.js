import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomModal from './CustomModal';

const ParentComponent = ({ username, userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState(null);
    const [toAccountId, setToAccountId] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/accounts`, {
                    params: { username: username }
                });
                setAccounts(response.data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };
        fetchAccounts();
    }, [username]);

    const handleTransfer = async () => {
        try {
            const transferRequest = {
                fromAccountId: fromAccountId,
                toAccountId: toAccountId,
                amount: amount
            };

            const response = await axios.post(`http://localhost:8080/transfer`, transferRequest, {
                params: { userId: userId },
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Transfer successful:', response.data);
            setIsModalOpen(false);
            setFromAccountId(null);
            setToAccountId(null);
            setAmount(0);
            fetchAccounts(username); // Refresh accounts after transfer
        } catch (error) {
            console.error('Error transferring:', error);
        }
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Transfer...</button>
            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Select Accounts for Transfer</h2>
                <label>
                    From Account:
                    <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)}>
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>{account.name} (ID: {account.id})</option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    To Account:
                    <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>{account.name} (ID: {account.id})</option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Amount:
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </label>
                <br />
                <button onClick={handleTransfer}>Transfer</button>
            </CustomModal>
        </div>
    );
};

export default ParentComponent;