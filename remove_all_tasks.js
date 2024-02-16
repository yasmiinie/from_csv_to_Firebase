const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Reference to Firestore collection
const db = admin.firestore();

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
