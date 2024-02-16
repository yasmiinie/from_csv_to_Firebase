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
    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        // Assuming 'organizer' is the column in your CSV
        const organizersFromCSV = row.organizer.split(','); // Split organizers by comma

        // Check if any of the organizers from CSV match the specified organizerIds
        const matchingOrganizers = organizersFromCSV.filter(organizerFromCSV =>
          organisateurIds.includes(organizerFromCSV.trim())
        );

        if (matchingOrganizers.length > 0) {
          
          const taskData = {
            checkIn: row.checkIn.toLowerCase() === 'true',
            day: parseInt(row.day, 10),
            description: row.description,
            start_time : admin.firestore.Timestamp.fromDate(new Date(row.start_time)),
            end_time : admin.firestore.Timestamp.fromDate(new Date(row.end_time)),
            title : row.title,
          };

          // Write task data to Firebase for each matching organizer
          matchingOrganizers.forEach(async organizerFromCSV => {
            await db.collection('organisateurs').doc(organizerFromCSV.trim())
              .collection('tasks').add(taskData);

            console.log('Data imported successfully for organizer ID:', organizerFromCSV.trim());
          });
        } else {
          console.log('Skipped importing data for organizers:', organizersFromCSV);
        }
      })
      .on('end', () => {
        console.log('CSV processing complete!');
      });

  } catch (error) {
    console.error('Error importing data:', error);
  }
}

const organisateurIds = ['1nnRQQneVdeB2T6S4S7gvFoyqN22', '4WAiEzNVzYeCTUzJzYOHerzHfHm2']; 
const filePath = './tache.csv'; 
importDataFromCSV(organisateurIds, filePath);
