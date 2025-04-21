import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { get, getDatabase, onValue, push, ref, set, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCYdFMSvsho0nWMnrP_3NshCHv56GI9Shw',
  authDomain: 'taste-mates-agile.firebaseapp.com',
  projectId: 'taste-mates-agile',
  storageBucket: 'taste-mates-agile.firebasestorage.app',
  messagingSenderId: '537335997088',
  appId: '1:537335997088:web:4a1e74ba7812911d32dfc5',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, db, get, onValue, provider, push, ref, set, signInWithPopup, update };
