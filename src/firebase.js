// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore';
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk6hLddPbZ5R7j_LBsFDDSZT64MVHrQjI",
  authDomain: "nest-ondc.firebaseapp.com",
  projectId: "nest-ondc",
  storageBucket: "nest-ondc.appspot.com",
  messagingSenderId: "318997633599",
  appId: "1:318997633599:web:41937faa0dda917365b68a",
  measurementId: "G-26EE7FZZZE"

};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize firestore and storage
const db = getFirestore(app);
const storage = getStorage(app);

export {db,storage}
