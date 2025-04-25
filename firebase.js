// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, remove, set } from 'firebase/database';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZgq-vlCrjYNPmqEQ0SKgUrT8UCBh7q9I",
  authDomain: "crossrealityblackjack.firebaseapp.com",
  projectId: "crossrealityblackjack",
  storageBucket: "crossrealityblackjack.firebasestorage.app",
  messagingSenderId: "202209416084",
  appId: "1:202209416084:web:209768afeed71e77193581",
  measurementId: "G-TL60285YEJ",
  databaseURL: "https://crossrealityblackjack-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export async function getPlayerCards(UId) {
  const playersRef = ref(database, `Players/${UId}/Cards`);
  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const cards = snapshot.val();
      const formattedCards = Object.values(cards).map(card => [card.Value, card.Suit]);
      return { UId, Cards: formattedCards };
    } else {
      console.log("No data available");
      return {UId, Cards: []};
    }
  } catch (error) {
    console.error("Error getting player cards: ", error);
      return {UId, Cards: []};
  }
}

export async function getPlayersDisplayNames() {
  const playersRef = ref(database, 'Players');
  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const players = snapshot.val();
      const displayNames = Object.keys(players).map(key => ({
        UId: key,
        displayName: players[key].DisplayName,
        isVirtual: players[key].isVirtual || false
      }));
      return displayNames;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error getting players: ", error);
    return [];
  }
}

export async function getActivePlayersWithCards() {
  const playersRef = ref(database, 'Players');
  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const players = snapshot.val();
      const allPlayers = Object.keys(players).map(key => {
        const cards = players[key].Cards 
          ? Object.values(players[key].Cards).map(card => [card.Value, card.Suit]) 
          : [];
        return { displayName: players[key].DisplayName, cards: cards };
      });
      return allPlayers;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error getting players: ", error);
    return [];
  }
}


export async function addPlayerCard(UId, card) {
  const playerCardsRef = ref(database, `Players/${UId}/Cards`);
  try {
    await import('firebase/database').then(({ runTransaction }) =>
      runTransaction(playerCardsRef, (cards) => {
        if (!cards) {
          cards = {};
        }
        // Find the next available card key
        let cardIndex = 1;
        while (cards[`Card${cardIndex}`]) {
          cardIndex++;
        }
        cards[`Card${cardIndex}`] = { Value: card[0], Suit: card[1] };
        return cards;
      })
    );
    console.log("Card added successfully");
  } catch (error) {
    console.error("Error adding card: ", error);
  }
}

export async function addDealerCard(card) {
  const dealerCardsRef = ref(database, 'Dealer/Cards');
  try {
    await import('firebase/database').then(({ runTransaction }) =>
      runTransaction(dealerCardsRef, (cards) => {
        if (!cards) {
          cards = {};
        }
        // Find the next available card key
        let cardIndex = 1;
        while (cards[`Card${cardIndex}`]) {
          cardIndex++;
        }
        cards[`Card${cardIndex}`] = { Value: card[0], Suit: card[1] };
        return cards;
      })
    );
    console.log("Dealer card added successfully");
  } catch (error) {
    console.error("Error adding dealer card: ", error);
    return { Cards: [] };
  }
}

export async function getDealerCards() {
  const dealerRef = ref(database, 'Dealer/Cards');
  try {
    const snapshot = await get(dealerRef);
    if (snapshot.exists() && snapshot.val()) {
      const cards = snapshot.val();
      const formattedCards = Object.values(cards).map(card => [card.Value, card.Suit]);
      return { Cards: formattedCards };
    } else {
      console.log("Dealer cards not found");
      return { Cards: [] };
    }
  } catch (error) {
    console.error("Error getting dealer cards: ", error);
    return { Cards: [] };
  }
}

export async function addNewPlayer(UId, displayName, isVirtual) {
  const playersRef = ref(database, `Players/${UId}`);
  try {
    await set(playersRef, {
      DisplayName: displayName,
      isVirtual: isVirtual,
      Cards: {}
    });
    console.log("Player added successfully");
  } catch (error) {
    console.error("Error adding player: ", error);
  }
}

export async function removePlayer(UId) {
  const playerRef = ref(database, `Players/${UId}`);
  try {
    await remove(playerRef);
    console.log("Player removed successfully");
  } catch (error) {
    console.error("Error removing player: ", error);
  }
}

export async function removeCards() {
  const dealerRef = ref(database, 'Dealer');
  try {
    await remove(dealerRef);
    console.log("Dealer removed successfully");
  } catch (error) {
    console.error("Error removing dealer cards: ", error);
  }
  
  const playersRef = ref(database, 'Players');
  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const players = snapshot.val();
      const playerKeys = Object.keys(players);
      for (const key of playerKeys) {
        const playerCardsRef = ref(database, `Players/${key}/Cards`);
        await remove(playerCardsRef);
      }
      console.log("All player cards removed successfully");
    } else {
      console.log("No players found to remove cards from");
    }
  } catch (error) {
    console.error("Error removing player cards: ", error);
  }
}

export async function getGamestatus() {
  const gameStateRef = ref(database, 'Gamestatus');
  try {
    const snapshot = await get(gameStateRef);
    if (snapshot.exists()) {
      const gameState = snapshot.val();
      return gameState;
    } else {
      console.log("No gamestatus available");
      return null;
    }
  } catch (error) {
    console.error("Error getting game state: ", error);
    return null;
  }
}

export async function setPlaying(isPlaying) {
  const gameStateRef = ref(database, 'Gamestatus/isPlaying');
  try {
    await set(gameStateRef, isPlaying);
    console.log("Game state updated successfully");
  } catch (error) {
    console.error("Error updating game state: ", error);
  }
}

export async function updateInstruction(cards) {
  const instructionRef = ref(database, 'Gamestatus/Instruction');
  try {
    await set(instructionRef, cards);
    console.log("Instruction updated successfully");
  } catch (error) {
    console.error("Error updating instruction: ", error);
  }
}

export async function updatePlayerAction(player) {
  const gameStateRef = ref(database, 'Gamestatus/PlayerAction');
  try {
    await set(gameStateRef, player);
    console.log("Player action updated successfully");
  } catch (error) {
    console.error("Error updating player action: ", error);
  }
}

export { auth }