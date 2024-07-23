import React from 'react';
import './Modal.css'; 

const Modal = ({
    isOpen,
    onClose,
    fromAccountId,
    setFromAccountId,
    toAccountId,
    setToAccountId,
    amount,
    setAmount,
    handleTransfer,
    accounts
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Select Accounts for Transfer...</h2>
                <label>
                    From:
                    <select value={fromAccountId} onChange={(e) => setFromAccountId(parseInt(e.target.value))}>
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.accountType} (ID: {account.id})
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    To:
                    <select value={toAccountId} onChange={(e) => setToAccountId(parseInt(e.target.value))}>
                        <option value="">Select an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.accountType} (ID: {account.id})
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount || ''}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </label>
                <br />
                <button onClick={handleTransfer}>Transfer</button>
            </div>
        </div>
    );
};

export default Modal;