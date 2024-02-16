const admin = require('firebase-admin');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



// Reference to Firestore collection
const db = admin.firestore();

// Path to your CSV file
const csvFilePath = './Orgnizers.csv';

// Define the CSV writer
const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    { id: 'id', title: 'UID' },
    { id: 'mail', title: 'mail' },
    { id: 'name', title: 'name' },
   
  ],
});

// Read data from Firestore collection and write to CSV file
const participantData = [];

db.collection('organisateurs').get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No documents found in the participants subcollection.');
      return;
    }

    snapshot.forEach(doc => {
      const uid = doc.id; // Use the generated UID (document id)

      console.log('Retrieved data:', doc.data()); // Add this line for debugging

      const participantInfo = doc.data();
      participantData.push({ id: uid, ...participantInfo });
    });

    // Write data to CSV file
    csvWriter.writeRecords(participantData)
      .then(() => {
        console.log('Data written to CSV file successfully.');
      })
      .catch(error => {
        console.error('Error writing to CSV file:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching data from Firestore:', error);
  });
