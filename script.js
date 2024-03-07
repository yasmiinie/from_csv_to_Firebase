import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC1RukDdzVdhA11J3EJLICIPSOFkij_N7k",
  authDomain: "organizers-app.firebaseapp.com",
  projectId: "organizers-app",
  storageBucket: "organizers-app.appspot.com",
  messagingSenderId: "509826767525",
  appId: "1:509826767525:web:0204810e41bc9b2b7ccb4c",
  measurementId: "G-0WHC6R6QGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
function deleteAllTasks() {
    // Get all documents from the 'organisateurs' collection
    db.collection('organisateurs').get()
      .then((organisateursQuerySnapshot) => {
        // Iterate through 'organisateurs' documents
        organisateursQuerySnapshot.forEach((organisateurDoc) => {
          // Reference to the 'tasks' collection inside each 'organisateur' document
          const tasksCollectionRef = organisateurDoc.ref.collection('tasks');
  
          // Delete all documents in the 'tasks' collection
          tasksCollectionRef.get()
            .then((tasksQuerySnapshot) => {
              tasksQuerySnapshot.forEach((taskDoc) => {
                taskDoc.ref.delete();
              });
            })
            .catch((tasksError) => {
              console.error('Error getting tasks documents: ', tasksError);
            });
        });
      })
      .catch((organisateursError) => {
        console.error('Error getting organisateurs documents: ', organisateursError);
      });
  }
