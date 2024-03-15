// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5gcHyhGAr2Ql0FqG1mylbE2OfeXY6ooM",
  authDomain: "backlogged-dev.firebaseapp.com",
  projectId: "backlogged-dev",
  storageBucket: "backlogged-dev.appspot.com",
  messagingSenderId: "470872883196",
  appId: "1:470872883196:web:dda95be223386037e2bc79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const completedGamesRef = collection(db, "CompletedGames");
export const liveGameEventsRef = collection(db, "LiveGameEvents");