import React, { use, useEffect, useState } from 'react';
import { addNewPlayer, getPlayersDisplayNames } from '../../firebase';

const Dealer = () => {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState('');
    const [instructions, setInstructions] = useState('');

    const addPlayer = () => { //Change this to add player to firebase
        console.log(`Adding player: ${newPlayer}`);
        
        addNewPlayer(newPlayer+"1", newPlayer, false).then(() => {
            setPlayers((prevPlayers) => [...prevPlayers, { displayName: newPlayer, isVirtual: false }]);
            setNewPlayer('');
        }).catch((error) => {
            console.error("Error adding player: ", error);
        });       
    };

    const removePlayer = (player) => { //Change this to remove player from firebase
        console.log(`Removing player: ${player}`);
    };

    useEffect(() => {
        getPlayersDisplayNames()
            .then((data) => {
                setPlayers(data);
            })
            .catch((error) => {
                console.error("Error fetching players: ", error);
            });
    },[]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <button 
                    style={{ 
                        padding: '10px 15px', 
                        border: 'none', 
                        borderRadius: '5px', 
                        backgroundColor: '#6c757d', 
                        color: '#fff', 
                        cursor: 'pointer' 
                    }} 
                    onClick={() => window.location.href = '/'}
                >
                    Home
                </button>
            </div>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>Dealer</h1>
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2 style={{ marginBottom: '10px', color: '#333' }}>Instructions</h2>
                    <p style={{ fontSize: '16px', color: instructions ? '#000' : '#888' }}>
                        {instructions || 'No instructions yet.'}
                    </p>
                </div>
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2 style={{ marginBottom: '10px', color: '#333' }}>Add Player</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Enter player name"
                            value={newPlayer}
                            onChange={(e) => setNewPlayer(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px',
                            }}
                        />
                        <button
                            onClick={addPlayer}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Add Player
                        </button>
                    </div>
                </div>
                <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2 style={{ marginBottom: '10px', color: '#333' }}>Players</h2>
                    {players.length === 0 ? (
                        <p style={{ fontSize: '16px', color: '#888' }}>No players added yet.</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {players.map((player, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    <span style={{ fontSize: '16px', color: '#000' }}>{player.displayName}</span>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => removePlayer(player.displayName)}
                                            disabled={player.isVirtual}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: player.isVirtual ? '#ccc' : '#f44336',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: player.isVirtual ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dealer;