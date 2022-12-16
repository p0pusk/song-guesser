// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjj4zrcVm2FrQlKv8BCeGs2I2hcGqscAo",
  authDomain: "songgame-aefca.firebaseapp.com",
  projectId: "songgame-aefca",
  storageBucket: "songgame-aefca.appspot.com",
  messagingSenderId: "780916150838",
  appId: "1:780916150838:web:dc85f9ba52f78f7f60be97",
  measurementId: "G-MK151WKQMD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth, db };
