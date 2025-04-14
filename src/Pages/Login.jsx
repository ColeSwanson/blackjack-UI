import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Add your login logic here
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <form onSubmit={handleSubmit} style={{
                width: '350px',
                padding: '30px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Welcome Back</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        color: '#555'
                    }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxSizing: 'border-box'
                        }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        color: '#555'
                    }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxSizing: 'border-box'
                        }}
                        required
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '10px'
                }}>
                    Login
                </button>
                <button type="button" onClick={() => window.location.href = '/signup'} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Login;