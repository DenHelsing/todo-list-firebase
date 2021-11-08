// import firebase from 'firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const config = {
  apiKey: 'AIzaSyAetX5KzAxa8ix7wEWJVEGDcebVBjSHUJI',
  authDomain: 'tododododododo.firebaseapp.com',
  databaseURL:
    'https://tododododododo-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'tododododododo',
  storageBucket: 'tododododododo.appspot.com',
  messagingSenderId: '186089720418',
  appId: '1:186089720418:web:033f53d052f12d4d4b9f3b',
  measurementId: 'G-WGHP7WS7T8'
};

const firebase = initializeApp(config);

// const db = getFirestore(firebase);

export default firebase;
