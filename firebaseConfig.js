// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqvV9nG03r5GRCKZuA8TQzyQON-34XdjY",
    authDomain: "advancedmap-41359.firebaseapp.com",
    projectId: "advancedmap-41359",
    storageBucket: "advancedmap-41359.appspot.com",
    messagingSenderId: "115914733686",
    appId: "1:115914733686:web:601b8f9f4f55c9a2270757",
    measurementId: "G-PC0NXLEN21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Create a database reference

export { app, database }; // Now you can export both app and database
