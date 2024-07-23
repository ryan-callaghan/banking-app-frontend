import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';

const AccountListPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [depositAmounts, setDepositAmounts] = useState({});
    const [amount, setAmount] = useState(0);
    const [newAccountType, setNewAccountType] = useState('');
    const [fromAccountId, setFromAccountId] = useState(null);
    const [toAccountId, setToAccountId] = useState(null);
    const location = useLocation();
    const username = location.state.username;
    const password = location.state.password;
    const id = location.state.id;
    const [error, setError] = useState(null);
    
    console.log('RECEIVED USERNAME: ', username);
    console.log('RECEIVED PASSWORD: ', password);
    console.log('RECEIVED ID: ', id);

    const fetchAccounts = async (username) => {
        const response = await axios.get(`http://localhost:8080/api/accounts?username=${username}`);
        setAccounts(response.data); 
    };

    useEffect(() => {
        /*if (username) {
            console.log('Sending GET Request');
            fetchAccounts(username);
        }
    }, [username]);*/
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFromAccountId(null);
        setToAccountId(null);
    };

    const handleDeposit = async (accountId) => {
        try {
            const amount = depositAmounts[accountId] || 0;
            const response = await axios.put(`http://localhost:8080/api/accounts/${accountId}/deposit`, amount, {headers:{'Content-Type': 'application/json',},}); 
            console.log('Deposit successful:', response.data);
            fetchAccounts(username);
        } catch (error) {
            console.error('Error depositing:', error);
        }
    };

    const handleWithdraw = async (accountId) => {
        try {
            const amount = depositAmounts[accountId] || 0;
            const response = await axios.put(`http://localhost:8080/api/accounts/${accountId}/withdraw`, amount, {headers:{'Content-Type': 'application/json',},});
            console.log('Withdraw successful:', response.data);
            fetchAccounts(username);
        } catch (error) {
            console.error('Error depositing:', error);
        }
    };

    const handleInputChange = (accountId, value) => {
        setDepositAmounts((prevAmounts) => ({
            ...prevAmounts,
            [accountId]: parseFloat(value)
        }));
    };

    const handleCreateNewAccount = async() =>{
        const response = await axios.post(`http://localhost:8080/api/accounts/${id}`,
            {
                accountType: newAccountType,
                balance: 0
            },
            {headers: 
                {'Content-Type': 'application/json',},
            }
        );
        setNewAccountType('');
        fetchAccounts(username);
    }

    const fetchAccountIds = async(username) => {
        const response = await axios.get('http://localhost:8080/api/accounts',{
            params: {username: username}
        });
        return response.data;
    }
    
    const handleTransfer = async () => {
        
        console.log('From Account ID:', fromAccountId);
        console.log('To Account ID:', toAccountId);
        console.log('Amount:', amount);
        
        const transferRequest = {
            fromAccountId: fromAccountId,
            toAccountId: toAccountId,
            amount: amount
        };
        const response = await axios.post(`http://localhost:8080/api/accounts/transfer`, transferRequest, {
            params: { userId: id },
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Transfer successful:', response.data);
        closeModal();
        fetchAccounts(username);
    };

    const handleDelete = async (accountId) => {
        const response = await axios.delete(`http://localhost:8080/api/accounts/${accountId}`);
        console.log('Deletion successful:', response.data);
        fetchAccounts(username);
    }

    return (
        <Container className="mt-4">
        <h2 className="mb-4">Welcome, {username}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
            {accounts.map(account => (
                <Col md={4} className="mb-4" key={account.id}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{account.accountType}</Card.Title>
                            <Card.Text>Balance: ${account.balance.toFixed(2)}</Card.Text>
                            <Form.Group className="mb-2">
                                <Form.Control
                                    type="number"
                                    placeholder="Enter amount"
                                    value={depositAmounts[account.id] || ''}
                                    onChange={(e) => setDepositAmounts(prev => ({ ...prev, [account.id]: parseFloat(e.target.value) }))}
                                />
                            </Form.Group>
                            <Button variant="primary" className="me-2" onClick={() => handleDeposit(account.id)}>Deposit</Button>
                            <Button variant="primary" className="me-2" onClick={() => handleWithdraw(account.id)}>Withdraw</Button>
                            <Button variant="secondary" onClick={() => handleDelete(account.id)}>Delete Account</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
        <Button variant="info" className="me-2" onClick={() => setIsModalOpen(true)}>Transfer...</Button>

        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Transfer Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>From:</Form.Label>
                        <Form.Control
                            as="select"
                            value={fromAccountId}
                            onChange={(e) => setFromAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>{account.accountType} (ID: {account.id})</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>To:</Form.Label>
                        <Form.Control
                            as="select"
                            value={toAccountId}
                            onChange={(e) => setToAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>{account.accountType} (ID: {account.id})</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                <Button variant="primary" onClick={handleTransfer}>Transfer</Button>
            </Modal.Footer>
        </Modal>
        <div className="mt-4">
            <h3>Create a New Account</h3>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Account Name"
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                />
            </Form.Group>
            <Button variant="success" onClick={handleCreateNewAccount}>Create Account</Button>
        </div>
    </Container>
    );
};

export default AccountListPage;