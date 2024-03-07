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
         matchingOrganizers = organizersFromCSV.filter(organizerFromCSV => {
          const trimmedOrganizer = organizerFromCSV.trim();
          return organisateurIds.includes(trimmedOrganizer) || trimmedOrganizer === '*';
        });

        if (matchingOrganizers.length > 0) {
          if (organizersFromCSV.includes('*')) {
            matchingOrganizers = organisateurIds;
          }
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

const organisateurIds = ['1K2CydQzirNpJaYUGz18McHmySl2','1nnRQQneVdeB2T6S4S7gvFoyqN22','4WAiEzNVzYeCTUzJzYOHerzHfHm2','5Zq7eBrtroaiJvzrHltMH1f2mNx1','5mOEIH2ytMQP0Q5fjaIWT5horAt2','72ARO6Dy5RZgJzwih8JKecrjam62','76lkus4UcDQZLO9cp5rjYz38jjE3','7DsB1CeLaRgwblungXCuK0WAkvy1','9VoIQnbPTbNO1OyHYFPbn7FDeUH2','9mXJaUaRi0UBMApWIPHDDHwVoBm2','ApAwFk0bXfh8FLE9iijL5vaiUdp1','BNMnZS3fFdX7wQWJ4PZP6L6tPeE2','CBeVg9rAfOU0zdt3PPuHldWSXOH2','CaEkHd05iuUQG4eRvckoSURNvnr1','CcUBQ81DRDfK69QzuhgsktHfTXi2','Dr7JZBtRX9WDnkTOI4GoK03C4bm1',' EsbKvOFw3dczI4zclN4QKpFIW0J2','G4IjNN3YvOVzX4hluVBD8UZSNPO2','GzjJiuSVBOMHUcu5yzOEkZAZr922','HtiKgKHkyiTRJoPWL9q6Jo8dn7n2','JAtcPwAOcDZr4siZPVpsDeZVwtI3','MDGHkiUVQnXdzVl3wHjbZpEy7DQ2','Mdka5FFC9Nd0QNjCHeLd9yDn0If1','QM4VfDRAepY5bqsWTmw5FaImrPm2','QnrGPhWKfBdy9xXzT83uEXByjCY2','Rs5Iqj7BLLNv5RSGJlI3IqIORJt1','S2gBB3gWm2PBDOhUNeQVa5WSPD02','SIw65aI8noa7xx8u3hE4R1fj7dM2','SsavCwTVfIZh2IzoLY23xfpLlFn2','TvP1Ospi42eh3LB2hNF8MPVJOpO2','ZkVxHM8rl2ZkRHiXgzbxvhL2RcA3','ZzJVQ3VEZUT8u7qBU7iRU1COxH53','amOIAnsP8wfogsskwogWeSz4qHP2','bZL93VgcdYRMcyTqvf7uBhMG9Gg2','csdKCFRoMkWHjmp8CzqoKlSsHHP2','dZcgH9zwDlUrO6P0NbQZspA7J252','fcEcKKR6ycRTDj3X2AUKbH7ZzVJ3','hb1GZuEFaSZ6HoGz40gdu3PKUmF3','iD3zDZ3Ylth9hY15mG7hM7FJoNV2','iaM8JiT0X4h9bTRGMRrZs2vF4Tr2','iaYef3VbESXvV3hLH9VD0cNlBOf2','jmjXKygBwefEMBopEBu915WOMVr1','mMKYbVsZJaXVU7Kjwyy1qGhLfDE2','mP1NBVbivNdsq2QzzkMVHAxFMPU2','osX88ZdfRjeYsKwiXaJO0eS4vc42','rB5mTw6SnKOD5aESPZBHEkf1pZo1','rM0ejIB6SLVdOrkkuAT0y37nzRJ2','sCpGAIfiMsSfjA5ltAkWNIubVgr1','t2Gszos4q9P4kRswb4ndMMs8w4q1','tdMweVQjJZQym236zlLuqtzTtI83','uncMAVBU8BOoTZFDhQOKFqXtuM62','uz1gGLXXbZftBtrXQOIMVwPRmrh2','xSC9xEdKHGYXliHsTxpBCTHB6v42','zFLJqdoY53Ss4pMIxO0RzJQLE3f1']; 
const filePath = './tache.csv'; 
importDataFromCSV(organisateurIds, filePath);
