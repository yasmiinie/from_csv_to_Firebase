import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs } from "firebase/firestore";




const app = initializeApp({
  apiKey: "AIzaSyC1RukDdzVdhA11J3EJLICIPSOFkij_N7k",
  authDomain: "organizers-app.firebaseapp.com",
  projectId: "organizers-app",
  storageBucket: "organizers-app.appspot.com",
  messagingSenderId: "509826767525",
  appId: "1:509826767525:web:0204810e41bc9b2b7ccb4c",
  measurementId: "G-0WHC6R6QGX"
});

const auth = getAuth();
const db = getFirestore(app);

export function deleteAllTasks() {
  // Add your delete logic here
  console.log("Deleting all tasks...");
}