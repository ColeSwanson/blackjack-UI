import { addDealerCard, addPlayerCard } from "../../firebase";

const suits = ['h', 's', 'c', 'd'];
const values = Array.from({ length: 13 }, (_, i) => (i + 1));

export async function getRandomCard(UId) {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];

    await addPlayerCard(UId, [randomValue, randomSuit]);
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
