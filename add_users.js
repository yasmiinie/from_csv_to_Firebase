const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Read CSV file and add users to Firebase Authentication
const csvFilePath = './csvfile.csv';

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Extract email and password from CSV row
    const email = row.email;
    const password = row.password;

    // Create user in Firebase Authentication
    admin.auth().createUser({
      email: email,
      password: password
    })
    .then((userRecord) => {
      console.log('Successfully created user:', userRecord.uid);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });
  })
  .on('end', () => {
    console.log('CSV file processing complete.');
  });
