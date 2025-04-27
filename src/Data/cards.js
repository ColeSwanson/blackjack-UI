import { addDealerCard, addPlayerCard } from "../../firebase";

const suits = ['h', 's', 'c', 'd'];
const values = Array.from({ length: 13 }, (_, i) => (i + 1));

export async function getRandomCard(UId) {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];

    await addPlayerCard(UId, [randomValue, randomSuit]);
}

export async function getRandomDealerCard() {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];

    await addDealerCard([randomValue, randomSuit]);
}

export async function dealCards(Players) {
    console.log('Dealing cards');
    for(let i = 0; i < 2; i++) {
        Players.forEach(player => {
            const randomSuit = suits[Math.floor(Math.random() * suits.length)];
            const randomValue = values[Math.floor(Math.random() * values.length)];
            addPlayerCard(player.UId, [randomValue, randomSuit]).then(() => {
                console.log(`Card dealt to player ${player.UId}: ${randomValue}${randomSuit}`);
            }).catch(error => {
                console.error(`Error dealing card to player ${player.UId}: ${error}`);
            });
        });
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const randomValue = values[Math.floor(Math.random() * values.length)];
        addDealerCard([randomValue, randomSuit]).then(() => {
            console.log(`Card dealt to dealer: ${randomValue}${randomSuit}`);
        }).catch(error => {
            console.error(`Error dealing card to dealer: ${error}`);
        });
    }
}

export const calculateHandValue = (hand) => {
    if (!hand || hand.length === 0) return 0;
    let value = 0;
    let aceCount = 0;

    hand.forEach(card => {
        // card is [value, suit]
        const cardValue = Array.isArray(card) ? card[0] : card;
        if (cardValue === 1) {
            value += 11;
            aceCount += 1;
        } else if (cardValue >= 11 && cardValue <= 13) {
            value += 10;
        } else if (cardValue >= 2 && cardValue <= 10) {
            value += cardValue;
        }
    });

    // Adjust for aces if value > 21
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
    }

    return value;
}
