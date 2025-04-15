import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredential = await signInWithEmailAndPassword(auth, email, password).then((userCredential) => { 
            console.log('User logged in:', userCredential.user);
            navigate('/player');
        }).catch((error) => {
            console.error('Error logging in:', error.message);
            alert('Login failed. Please check your credentials.');
        });
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
                <p style={{ marginBottom: '10px', color: '#555' }}>Are you new here?</p>
                <button type="button" onClick={() => navigate('/signup')} style={{
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