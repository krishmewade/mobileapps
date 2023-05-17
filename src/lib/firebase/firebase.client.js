// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth'


// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCmXpez9xiMX4XEvKzScn9gOkXGYKjI7ck",
  authDomain: "finalproject-7ce8e.firebaseapp.com",
  projectId: "finalproject-7ce8e",
  storageBucket: "finalproject-7ce8e.appspot.com",
  messagingSenderId: "702721177565",
  appId: "1:702721177565:web:2040924270852b638c6834",
  measurementId: "G-0GDSEVZ9T5"
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length){
  firebaseApp = initializeApp(firebaseConfig)
} else {
  firebaseApp = getApp()
  deleteApp(firebaseApp)
  firebaseApp = initializeApp(firebaseConfig)
}

export const auth = getAuth(firebaseApp)