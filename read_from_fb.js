const admin = require('firebase-admin');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const serviceAccount = require('./serviceAccountKey.json');

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
const csvFilePath = './updatedParticipants.csv';

// Define the CSV writer
const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    { id: 'id', title: 'UID' },
    { id: 'scannedbool', title: 'Scanned Bool' },
    { id: 'phone', title: 'Phone' },
    { id: 'fullName', title: 'Full Name' },
    { id: 'team', title: 'Team' },
    // Add more fields as needed
  ],
});

// Read data from Firestore collection and write to CSV file
const participantData = [];

specificDocumentRef.collection('participants').get()
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
