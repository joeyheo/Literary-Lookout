// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLpDR8KQiAkWqRunFoImx0C7MhEfJGRM0",
  authDomain: "literarylookout.firebaseapp.com",
  projectId: "literarylookout",
  storageBucket: "literarylookout.appspot.com",
  messagingSenderId: "403702741437",
  appId: "1:403702741437:web:029ac242efc061010dfad4",
  measurementId: "G-KNF2RHG510",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
