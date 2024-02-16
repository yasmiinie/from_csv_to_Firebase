const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to read data from CSV and write to Firebase
async function importDataFromCSV(organisateurIds, filePath) {
  try {
    organisateurIds.forEach(async (organisateurId) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          // Assuming 'organizer' is the column in your CSV
          const organizerIdFromCSV = row.organizer;

          // Check if the organizerId from CSV matches the specified organizerId
          if (organizerIdFromCSV === organisateurId) {
            const taskData = {
              checkIn: row.checkIn,
              day: row.day,
              description: row.description,
              // Add other attributes as needed
            };

            // Write task data to Firebase
            await db.collection('organisateurs').doc(organisateurId)
              .collection('tasks').add(taskData);

            console.log('Data imported successfully for organizer ID:', organizerIdFromCSV);
          } else {
            console.log('Skipped importing data for organizer ID:', organizerIdFromCSV);
          }
        })
        .on('end', () => {
          console.log(`CSV processing complete for organizer ID: ${organisateurId}`);
        });
    });
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

const organisateurIds = ['1nnRQQneVdeB2T6S4S7gvFoyqN22','4WAiEzNVzYeCTUzJzYOHerzHfHm2']; 
const filePath = './tache.csv'; 
importDataFromCSV(organisateurIds, filePath);
