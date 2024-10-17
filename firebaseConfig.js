import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCqvV9nG03r5GRCKZuA8TQzyQON-34XdjY",
    authDomain: "advancedmap-41359.firebaseapp.com",
    projectId: "advancedmap-41359",
    storageBucket: "advancedmap-41359.appspot.com",
    messagingSenderId: "115914733686",
    appId: "1:115914733686:web:601b8f9f4f55c9a2270757",
    measurementId: "G-PC0NXLEN21"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firestore();