const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const serviceAccount = require('./serviceAccountKey.json'); // Replace with the path to your service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace 'Events' with the name of your Firestore collection
const eventsCollectionName = 'Events';


const specificDocumentId = 'rh51g2ICQPTSJaB9V8tr';

// Reference to Firestore collection
const db = admin.firestore();
const eventsCollectionRef = db.collection(eventsCollectionName);

// Reference to the specific document within 'Events' collection
const specificDocumentRef = eventsCollectionRef.doc(specificDocumentId);

// Path to your CSV file
const csvFilePath = './partiicipants.csv'; // Replace with the path to your CSV file

// Prepare boolean value
const bool = false;  // Set to false or true as needed

// Read data from CSV file
const eventData = [];
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Set the boolean field to false for each record
    row.scannedbool = bool;
    eventData.push(row);
  })
  .on('end', () => {
    // Upload data to 'participants' subcollection within the specific document in 'Events' collection
    const participantsSubcollectionRef = specificDocumentRef.collection('participants');

    eventData.forEach((eventDataItem) => {
      participantsSubcollectionRef.add(eventDataItem);
    });

    console.log('Data uploaded to participants subcollection within the specific document in Events collection successfully.');
  });
