import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDhugp9U5MbiIQAcL9DUTHvqYIeU4X_aAA",
    authDomain: "tienda-980d9.firebaseapp.com",
  projectId: "tienda-980d9",
  storageBucket: "tienda-980d9.appspot.com",
  messagingSenderId: "502960439587",
  appId: "1:502960439587:web:aaa2f99ef8eeee6e390c96",
  measurementId: "G-ER882RJ8PD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };