import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Player = () => {
    const { user } = useAuth(); 
    const cards = [[1, "S"], [11, "H"]]; // TODO: we will need to get this from firebase once we have the user
    const dealerCards = [[10, "D"], [7, "H"]]; // TODO: we will need to get this from firebase
    const activePlayers = [
        { username: "Player1", cards: [[1, "H"], [5, "D"]] },
        { username: "Player2", cards: [[7, "H"], [9, "S"]] },
        { username: "Player3c", cards: [[4, "D"], [11, "C"]] }
    ]; // TODO: Fetch this data from firebase
    const showSecondDealerCard = false; // Boolean to control whether the second card is displayed
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        signOut(auth).catch((error) => {
            console.error("Error logging out:", error);
        });
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
                <button
                onClick={handleLogout}
                style={{
                    padding: '8px 15px',
                    fontSize: '16px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, transform 0.2s'
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#5a6268';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#6c757d';
                    e.target.style.transform = 'scale(1)';
                }}
                >
                    Logout
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, transform 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#5a6268';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#6c757d';
                        e.target.style.transform = 'scale(1)';
                    }}
                    onClick={() => navigate('/')}
                >
                    Home
                </button>
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ color: '#333' }}>Dealer's Cards</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {dealerCards.map((card, index) => {
                            if (index === 1 && !showSecondDealerCard) {
                                return (
                                    <div key={index} style={{
                                        width: '50px',
                                        height: '70px',
                                        border: '1px solid #000',
                                        borderRadius: '5px',
                                        backgroundColor: '#ccc',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '5px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>?</span>
                                    </div>
                                );
                            }
                            const cardValue = card[0] === 1 ? 'A' : card[0] === 11 ? 'J' : card[0] === 12 ? 'Q' : card[0] === 13 ? 'K' : card[0];
                            return (
                                <div key={index} style={{
                                    width: '50px',
                                    height: '70px',
                                    border: '1px solid #000',
                                    borderRadius: '5px',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '5px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cardValue}</span>
                                    <span style={{ fontSize: '20px', color: card[1] === 'H' || card[1] === 'D' ? 'red' : 'black' }}>
                                        {card[1] === 'H' ? '♥' : card[1] === 'D' ? '♦' : card[1] === 'S' ? '♠' : '♣'}
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', transform: 'rotate(180deg)' }}>{cardValue}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <h2 style={{ textAlign: 'center', color: '#333' }}>{user.displayName}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                    {cards.map((card, index) => {
                        const cardValue = card[0] === 1 ? 'A' : card[0] === 11 ? 'J' : card[0] === 12 ? 'Q' : card[0] === 13 ? 'K' : card[0];
                        return (
                            <div key={index} style={{
                                width: '50px',
                                height: '70px',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '5px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cardValue}</span>
                                <span style={{ fontSize: '20px', color: card[1] === 'H' || card[1] === 'D' ? 'red' : 'black' }}>
                                    {card[1] === 'H' ? '♥' : card[1] === 'D' ? '♦' : card[1] === 'S' ? '♠' : '♣'}
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', transform: 'rotate(180deg)' }}>{cardValue}</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
                    <button style={{ padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.2s' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0056b3';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                            e.target.style.transform = 'scale(1)';
                        }}
                        onClick={() => console.log("Hit")}>Hit</button>
                    <button style={{ padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.2s' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#218838';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#28a745';
                            e.target.style.transform = 'scale(1)';
                        }}
                        onClick={() => console.log("Double Down")}>Double Down</button>
                    <button style={{ padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#ffc107', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.2s' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#e0a800';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#ffc107';
                            e.target.style.transform = 'scale(1)';
                        }}
                        onClick={() => console.log("Split")}>Split</button>
                    <button style={{ padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer', transition: 'background-color 0.3s, transform 0.2s' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                            e.target.style.transform = 'scale(1)';
                        }}
                        onClick={() => console.log("Stand")}>Stand</button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ textAlign: 'center', color: '#333' }}>Active Players</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {activePlayers.map((player, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <h4 style={{ marginBottom: '5px', color: '#555' }}>{player.username}</h4>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    {player.cards.map((card, cardIndex) => {
                                        const cardValue = card[0] === 1 ? 'A' : card[0] === 11 ? 'J' : card[0] === 12 ? 'Q' : card[0] === 13 ? 'K' : card[0];
                                        return (
                                            <div key={cardIndex} style={{
                                                width: '50px',
                                                height: '70px',
                                                border: '1px solid #000',
                                                borderRadius: '5px',
                                                backgroundColor: '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '5px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                            }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cardValue}</span>
                                                <span style={{ fontSize: '20px', color: card[1] === 'H' || card[1] === 'D' ? 'red' : 'black' }}>
                                                    {card[1] === 'H' ? '♥' : card[1] === 'D' ? '♦' : card[1] === 'S' ? '♠' : '♣'}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', transform: 'rotate(180deg)' }}>{cardValue}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Player;