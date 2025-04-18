// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';


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

async function getPlayerCards(UId) {
  const playersRef = ref(database, `Players/${UId}/Cards`);
  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const cards = snapshot.val();
      const formattedCards = Object.values(cards).map(card => [card.Value, card.Suit]);
      return { UId, Cards: formattedCards };
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error getting player cards: ", error);
    return null;
  }
}

async function getActivePlayersWithCards() {
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

export { auth, getPlayerCards, getActivePlayersWithCards }