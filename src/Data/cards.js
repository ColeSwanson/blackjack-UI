function getRandomCard() {
    const suits = ['h', 's', 'c', 'd'];
    const values = Array.from({ length: 13 }, (_, i) => (i + 1));

    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];

    return [randomValue, randomSuit];
}

export default getRandomCard;