import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { addNewPlayer, auth, getActivePlayersWithCards, getDealerCards, getPlayerCards, removePlayer } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import getRandomCard from '../Data/cards';

const Player = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]); // TODO: we will need to get this from firebase once we have the user
    const [value, setValue] = useState([0]);
    const [dealerCards, setDealerCards] = useState([]); // TODO: we will need to get this from firebase
    const [activePlayers, setActivePlayers] = useState([]); // TODO: Fetch this data from firebase
    const [showSecondDealerCard, setShowSecondDealerCard] = useState(false); // Boolean to control whether the second card is displayed
    const [canHit, setCanHit] = useState(true); // Boolean to control whether the player can hit
    const [canDoubleDown, setCanDoubleDown] = useState(true); // Boolean to control whether the player can double down
    const [canSplit, setCanSplit] = useState(false); // Boolean to control whether the player can split
    const [canStand, setCanStand] = useState(true); // Boolean to control whether the player can stand

    const [playerAction, setPlayerAction] = useState(null); // State to track the player's action
    const [primaryHand, setPrimaryHand] = useState(0); // State to track the primary hand of the player

    const handleLogout = () => {
        removePlayer(user.uid).then(() => {
            console.log("Player removed successfully");
        }).catch((error) => {
            console.error("Error removing player:", error);
        });

        signOut(auth).catch((error) => {
            console.error("Error logging out:", error);
        });

        navigate('/');
    }

    const handleHome = () => {
        navigate('/');

        removePlayer(user.uid).then(() => {
            console.log("Player removed successfully");
        }).catch((error) => {
            console.error("Error removing player:", error);
        });
    }

    // Calculate the value of the player's hands
    const calculateHandValue = (hand) => {
        let total = 0;
        let aces = 0;

        hand.forEach(([value]) => {
            if (value === 1) {
                aces += 1;
                total += 11; // Treat Ace as 11 initially
            } else if (value >= 11 && value <= 13) {
                total += 10; // Face cards are worth 10
            } else {
                total += value;
            }
        });

        // Adjust for Aces if total exceeds 21
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    };

    useEffect(() => {
        addNewPlayer(user.uid, user.displayName, true).then(() => {
            console.log("Player added successfully");
        }).catch((error) => {
            console.error("Error adding player:", error);
        });

        getPlayerCards(user.uid).then((data) => {
            setCards(data.Cards);
        }).catch((error) => {
            console.error("Error fetching player cards:", error);
        });

        getActivePlayersWithCards().then((data) => {
            setActivePlayers(data);
        }).catch((error) => {
            console.error("Error fetching active players:", error);
        });

        getDealerCards().then((data) => {
            setDealerCards(data.Cards);
        }
        ).catch((error) => {
            console.error("Error fetching dealer cards:", error);
        });
    }, []);

    useEffect(() => {
        if (cards.length > 0) {
            if (cards.length === 2 && cards[0][0] === cards[1][0]) {
                setCanSplit(true);
            } else {
                setCanSplit(false);
            }

            if (cards.length === 2) {
                setCanDoubleDown(true);
            } else {
                setCanDoubleDown(false);
            }

            if (Array.isArray(cards[0][0])) {
                // If the player has split, calculate the value for each hand
                const handValues = cards.map((hand) => calculateHandValue(hand));
                setValue(handValues);

                if (handValues[primaryHand] >= 21) {
                    if (primaryHand < cards.length - 1) {
                        setPrimaryHand((prevPrimaryHand) => prevPrimaryHand + 1);
                    } else {
                        setPlayerAction("Stand");
                    }
                }
            } else {
                // Otherwise, calculate the value for the single hand
                const handValue = calculateHandValue(cards);
                setValue([handValue]);

                if (handValue >= 21) {
                    setPlayerAction("Stand");
                }
            }

            if (playerAction === "Stand") {
                setCanHit(false); // Disable hit after the player hits
                setCanDoubleDown(false); // Disable double down after the player hits
                setCanSplit(false); // Disable split after the player hits
                setCanStand(false); // Disable stand after the player hits
            }

            console.log(getPlayerCards(user.uid));
        }
    }, [cards, playerAction, primaryHand]);

    const handleHit = () => {
        console.log("Hit action triggered");
        setPlayerAction("Hit");

        if (Array.isArray(cards[0][0])) {
            // If the player has split, apply the hit to the hand indicated by primaryHand
            setCards((prevCards) => {
                const updatedHands = [...prevCards];
                updatedHands[primaryHand] = [...updatedHands[primaryHand], getRandomCard()];
                return updatedHands;
            });
        } else {
            // Otherwise, apply the hit to the single hand
            setCards((prevCards) => [...prevCards, getRandomCard()]);
        }

        setPlayerAction(null); // Reset action after hitting
    };

    const handleDoubleDown = () => {
        console.log("Double Down action triggered");
        setPlayerAction("Double Down");
        // TODO: Implement logic to double the player's bet

        if (Array.isArray(cards[0][0])) {
            // If the player has split, apply the double down to the hand indicated by primaryHand
            setCards((prevCards) => {
                const updatedHands = [...prevCards];
                updatedHands[primaryHand] = [...updatedHands[primaryHand], getRandomCard()];
                return updatedHands;
            });

            if (primaryHand < cards.length - 1) {
                setPrimaryHand((prevPrimaryHand) => prevPrimaryHand + 1);
            } else {
                setPlayerAction("Stand"); // Stand if it's the final hand
            }
        } else {
            // Otherwise, apply the double down to the single hand
            setCards((prevCards) => [...prevCards, getRandomCard()]);
            setPlayerAction("Stand"); // Player must stand after doubling down
        }
    };

    const handleSplit = () => {
        console.log("Split action triggered");
        setPlayerAction("Split");

        if (cards.length === 2 && cards[0][0] === cards[1][0]) {
            const newHands = [
                [cards[0], getRandomCard()], // First hand with the first card and a new card
                [cards[1], getRandomCard()]  // Second hand with the second card and a new card
            ];
            setCards(newHands); // Update the state to reflect the split hands
        }

        setCanSplit(false); // Disable split after splitting
    };

    const handleStand = () => {
        console.log("Stand action triggered");

        if (Array.isArray(cards[0][0]) && primaryHand < cards.length - 1) {
            // If the player has split and there are more hands to play, move to the next hand
            setPrimaryHand((prevPrimaryHand) => prevPrimaryHand + 1);
        } else {
            setPlayerAction("Stand")
        }
    };

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
                    onClick={handleHome}
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                    {cards.length === 0 ? (
                        <p style={{ color: '#555', textAlign: 'center' }}>No cards to display</p>
                    ) : Array.isArray(cards[0]) && cards[0].length === 0 ? (
                        <p style={{ color: '#555', textAlign: 'center' }}>No cards to display</p>
                    ) : Array.isArray(cards[0][0]) ? (
                        cards.map((hand, handIndex) => (
                            <div key={handIndex} style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                border: handIndex === primaryHand ? '2px solid #007bff' : 'none', 
                                borderRadius: '5px', 
                                padding: '10px' 
                            }}>
                                <h4 style={{ marginBottom: '10px', color: handIndex === primaryHand ? '#007bff' : '#555' }}>
                                    Hand {handIndex + 1}
                                </h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {hand.map((card, index) => {
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
                        ))
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
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
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
                    <button 
                        style={{ 
                            padding: '10px 15px', 
                            border: 'none', 
                            borderRadius: '5px', 
                            backgroundColor: canHit ? '#007bff' : '#d6d6d6', 
                            color: canHit ? '#fff' : '#a1a1a1', 
                            cursor: canHit ? 'pointer' : 'not-allowed', 
                            transition: canHit ? 'background-color 0.3s, transform 0.2s' : 'none'
                        }}
                        onMouseOver={(e) => {
                            if(canHit)
                            {
                                e.target.style.backgroundColor = '#0056b3';
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if(canHit)
                            {
                                e.target.style.backgroundColor = '#007bff';
                                e.target.style.transform = 'scale(1)';
                            }
                        }}
                        disabled={!canHit}
                        onClick={() => handleHit()}>Hit</button>
                    <button 
                        style={{ 
                            padding: '10px 15px', 
                            border: 'none', 
                            borderRadius: '5px', 
                            backgroundColor: canDoubleDown ? '#28a745' : '#d6d6d6', 
                            color: canDoubleDown ? '#fff' : '#a1a1a1', 
                            cursor: canDoubleDown ? 'pointer' : 'not-allowed', 
                            transition: canDoubleDown ? 'background-color 0.3s, transform 0.2s' : 'none'
                        }}
                        onMouseOver={(e) => {
                            if (canDoubleDown)
                            {
                                e.target.style.backgroundColor = '#218838';
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (canDoubleDown)
                            {
                                e.target.style.backgroundColor = '#28a745';
                                e.target.style.transform = 'scale(1)';
                            }
                        }}
                        disabled={!canDoubleDown}
                        onClick={() => handleDoubleDown()}>Double Down</button>
                    <button 
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            backgroundColor: canSplit ? '#ffc107' : '#d6d6d6',
                            color: canSplit ? '#fff' : '#a1a1a1',
                            cursor: canSplit ? 'pointer' : 'not-allowed',
                            transition: canSplit ? 'background-color 0.3s, transform 0.2s' : 'none'
                        }}
                        onMouseOver={(e) => {
                            if (canSplit) {
                                e.target.style.backgroundColor = '#e0a800';
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (canSplit) {
                                e.target.style.backgroundColor = '#ffc107';
                                e.target.style.transform = 'scale(1)';
                            }
                        }}
                        disabled={!canSplit}
                        onClick={() => handleSplit()}>Split</button>
                    <button 
                        style={{ 
                            padding: '10px 15px', 
                            border: 'none', 
                            borderRadius: '5px',
                            backgroundColor: canStand ? '#dc3545' : '#d6d6d6', 
                            color: canStand ? '#fff' : '#a1a1a1',
                            cursor: canStand ? 'pointer' : 'not-allowed',
                            transition: canStand ? 'background-color 0.3s, transform 0.2s' : 'none'
                        }}
                        onMouseOver={(e) => {
                            if(canStand)
                            {
                                e.target.style.backgroundColor = '#c82333';
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if(canStand)
                            {
                                e.target.style.backgroundColor = '#dc3545';
                                e.target.style.transform = 'scale(1)';
                            }
                        }}
                        disabled={!canStand}
                        onClick={() => handleStand()}>Stand</button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ textAlign: 'center', color: '#333' }}>Active Players</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {activePlayers.map((player, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <h4 style={{ marginBottom: '5px', color: '#555' }}>{player.displayName}</h4>
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