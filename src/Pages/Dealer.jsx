import React, { use, useEffect, useState } from 'react';
import { addNewPlayer, getDealerCards, getGamestatus, getPlayerAction, getPlayersDisplayNames, removeCards, removePlayer, setInitialDealDone, setPlaying, updateInstruction, updatePlayerAction, updatePlayerTurn } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { calculateHandValue, dealCards, getRandomCard, getRandomDealerCard } from '../Data/cards';
import { get } from 'firebase/database';

const Dealer = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState('');
    const [gameStatus, setGameStatus] = useState('');
    const [update, setUpdate] = useState(false);

    const handleHome = () => {
        navigate('/');
        handleEndGame();
    };

    const addPlayer = () => {       
        addNewPlayer(newPlayer+"1", newPlayer, false).then(() => {
            setPlayers((prevPlayers) => [...prevPlayers, { UId:newPlayer+"1" ,displayName: newPlayer, isVirtual: false }]);
            setNewPlayer('');
        }).catch((error) => {
            console.error("Error adding player: ", error);
        });       
        setUpdate(true);
    };

    const handleRemovePlayer = (UId) => { 
        removePlayer(UId).then(() => {
            setPlayers((prevPlayers) => prevPlayers.filter(player => player.UId !== UId))
        })
        .catch((error) => {
            console.error("Error removing player: ", error);
        });
        setUpdate(true);
    };

    const handleStartGame = () => {
        setPlaying(true).then(() => {
            console.log("Game started successfully");
        })
        .catch((error) => {
            console.error("Error starting game: ", error);
        });

        // Set the player turn to the first player's UId
        if (players.length > 0) {
            updatePlayerTurn(players[0].UId).then(() => {
                console.log("Player turn set successfully");
            })
            .catch((error) => {
                console.error("Error setting player turn: ", error);
            });
        }

        // updateInstruction("Waiting on " + players[0].displayName +"'s action").then(() => {
        //     console.log("Instruction updated successfully");
        // })
        // .catch((error) => {
        //     console.error("Error updating instruction: ", error);
        // });

        // //TEMPORARY
        // dealCards(players).then(() => {
        //     console.log("Cards dealt successfully");
        // })
        // .catch((error) => {
        //     console.error("Error dealing cards: ", error);
        // });
        
        setUpdate(true);
    }

    const handleEndGame = () => {
        setPlaying(false).then(() => {
            console.log("Game ended successfully");
        })
        .catch((error) => {
            console.error("Error ending game: ", error);
        });

        setInitialDealDone(false).then(() => {
            console.log("Initial deal state reset successfully");
        }).catch((error) => {
            console.error("Error resetting initial deal state: ", error);
        });

        updateInstruction("Start Game").then(() => {
            console.log("Instruction updated successfully");
        })
        .catch((error) => {
            console.error("Error updating instruction: ", error);
        });

        updatePlayerTurn("").then(() => {
            console.log("Player turn reset successfully");
        })
        .catch((error) => {
            console.error("Error resetting player turn: ", error);
        });

        removeCards().then(() => {
            console.log("Dealer cards removed successfully");
        })
        .catch((error) => {
            console.error("Error removing dealer cards: ", error);
        });

        players.forEach(player => {
            updatePlayerAction(player.UId, "");
        });

        setUpdate(true);
    }


    const fetchData = () => {
        getPlayersDisplayNames().then((data) => {
            setPlayers(data);
        })
        .catch((error) => {
            console.error("Error fetching players: ", error);
        });

        getGamestatus().then((data) => {
            setGameStatus(data);

            if(data.PlayerTurn){
                const currentPlayerIndex = players.findIndex(p => p.UId === data.PlayerTurn);
                if (currentPlayerIndex !== -1) {
                    const currentPlayer = players[currentPlayerIndex];
                    // Fetch the current player's action from Firestore
                    // Assuming updatePlayerAction returns a Promise that resolves to the action string
                    // If you have a getPlayerAction function, use that instead
                    getPlayerAction(currentPlayer.UId).then((action) => {
                        if (action === "Stand") { // If last player, set turn to dealer
                            if (currentPlayerIndex === players.length - 1) {
                                updatePlayerTurn("Dealer").then(() => {
                                    console.log("Player turn set to dealer successfully");
                                    updateInstruction("Deal card to dealer").then(() => {
                                        console.log("Instruction updated successfully");
                                    }).catch((error) => {
                                        console.error("Error updating instruction: ", error);
                                    });
                                }).catch((error) => {
                                    console.error("Error setting player turn to dealer: ", error);
                                });
                            } else {
                                // Otherwise, set turn to next player
                                updatePlayerTurn(players[currentPlayerIndex + 1].UId).then(() => {
                                    console.log("Player turn set to next player successfully");
                                    updateInstruction("Waiting on " + players[currentPlayerIndex + 1].displayName + "'s action").then(() => {
                                        console.log("Instruction updated successfully");
                                    }).catch((error) => {
                                        console.error("Error updating instruction: ", error);
                                    });
                                }).catch((error) => {
                                    console.error("Error setting player turn to next player: ", error);
                                });
                            }
                        }
                        else if (action === "Hit") {
                            updateInstruction("Deal card to " + currentPlayer.displayName).then(() => {
                                console.log("Instruction updated successfully");
                            }).catch((error) => {
                                console.error("Error updating instruction: ", error);
                            });

                            updatePlayerAction(currentPlayer.UId, "").then(() => {
                                console.log("Player action updated successfully");
                            }).catch((error) => {
                                console.error("Error updating player action: ", error);
                            });

                            // updateInstruction("Waiting on " + currentPlayer.displayName + "'s action").then(() => {
                            //     console.log("Instruction updated successfully");
                            // }).catch((error) => {
                            //     console.error("Error updating instruction: ", error);
                            // });
                        }
                        else if (action === "Double Down") {
                            updateInstruction("Deal card to " + currentPlayer.displayName + " (Double Down)").then(() => {
                                console.log("Instruction updated successfully");
                            }).catch((error) => {
                                console.error("Error updating instruction: ", error);
                            });

                            // //temporary
                            // updatePlayerAction(currentPlayer.UId, "Stand").then(() => {
                            //     console.log("Player action updated successfully");
                            // }).catch((error) => {
                            //     console.error("Error updating player action: ", error);
                            // });

                            // getRandomCard(currentPlayer.UId).then(() => {
                            //     console.log("Card dealt to " + currentPlayer.displayName + " (Double Down)");
                            // }).catch((error) => {
                            //     console.error("Error dealing card to player: ", error);
                            // });
                        }
                    }).catch((error) => {
                        console.error("Error fetching player action: ", error);
                    });
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching game status: ", error);
        });
    }

    useEffect(() => {
        setUpdate(false);
        fetchData();

        const intervalId = setInterval(fetchData, 2000); // Fetch every 2 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [update]);

    // const playDealerTurn = async () => {
    //     try {
    //         let dealerValue = null;
    //         await getDealerCards().then((data) => {
    //             console.log("Dealer hand: ", data);
    //             dealerValue = calculateHandValue(data.Cards);
    //         }).catch((error) => {
    //             console.error("Error fetching dealer cards: ", error);
    //         });

    //         // Dealer hits until 17 or more
    //         if (dealerValue < 17) {
    //             updateInstruction("Deal card to dealer").then(() => {
    //                 console.log("Instruction updated successfully");
    //             }).catch((error) => {
    //                 console.error("Error updating instruction: ", error);
    //             });

    //             // updatePlayerTurn("").then(() => {
    //             //     console.log("Player turn reset successfully");
    //             // }).catch((error) => {
    //             //     console.error("Error resetting player turn: ", error);
    //             // });

    //             // // Temporary
    //             // getRandomDealerCard().then(() => {
    //             //     console.log("Dealer hits and gets a card");
    //             //     playDealerTurn(); // Call again to check the new value
    //             // }).catch((error) => {
    //             //     console.error("Error dealing card to dealer: ", error);
    //             // });

    //             // updatePlayerTurn("dealer").then(() => {
    //             //     console.log("Player turn reset to dealer successfully");
    //             // }).catch((error) => {
    //             //     console.error("Error set player turn to dealer: ", error);
    //             // });
    //         }
    //         else if (dealerValue > 21) {
    //             updateInstruction("Dealer busts with " + dealerValue).then(() => {
    //                 console.log("Instruction updated successfully");
    //             }).catch((error) => {
    //                 console.error("Error updating instruction: ", error);
    //             });
    //         }
    //         else {
    //             updateInstruction("Dealer stands with " + dealerValue).then(() => {
    //                 console.log("Instruction updated successfully");
    //             }).catch((error) => {
    //                 console.error("Error updating instruction: ", error);
    //             });
    //         }
    //         setUpdate(true);
    //     } catch (err) {
    //         console.error("Error during dealer's turn:", err);
    //     }
    // };

    // useEffect(() => {
    //     // Dealer's turn logic
    //     if (
    //         gameStatus.PlayerTurn === "dealer" &&
    //         gameStatus.isPlaying &&
    //         players.length > 0
    //     ) {
    //         playDealerTurn();
    //     }
    //     // eslint-disable-next-line
    // }, [gameStatus.PlayerTurn, gameStatus.isPlaying]);

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
                    onClick={handleHome}
                >
                    Home
                </button>
            </div>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>Dealer</h1>
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2 style={{ marginBottom: '10px', color: '#333' }}>Instructions</h2>
                    <p style={{ fontSize: '16px', color: gameStatus.Instruction ? '#000' : '#888' }}>
                        {gameStatus.Instruction || 'No instructions yet.'}
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
                            disabled={!newPlayer}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: newPlayer ? '#4CAF50' : '#ccc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: newPlayer ? 'pointer' : 'not-allowed',
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
                                            onClick={() => handleRemovePlayer(player.UId)}
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
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {gameStatus.isPlaying ? (
                        <button
                            onClick={() => {
                                handleEndGame();                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            End Game
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                handleStartGame();
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Start Game
                        </button>
                    )}
                </div>
            </div>
            {gameStatus.PlayerTurn && players.length > 0 && (() => {
                const currentPlayer = players.find(p => p.UId === gameStatus.PlayerTurn);
                if (currentPlayer && !currentPlayer.isVirtual) {
                    return (
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button
                                onClick={() => updatePlayerAction(currentPlayer.UId, "Stand").then(() => setUpdate(true))}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196F3',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Stand
                            </button>
                        </div>
                    );
                }
                return null;
            })()}
        </>
    );
};

export default Dealer;