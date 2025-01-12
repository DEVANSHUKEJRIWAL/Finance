// import Papa from 'papaparse';
// import { format } from 'date-fns';

// export async function loadCSVData(file: string) {
//   try {
//     const response = await fetch(file);
//     const csvText = await response.text();
//     return new Promise((resolve, reject) => {
//       Papa.parse(csvText, {
//         header: true,
//         dynamicTyping: true,
//         complete: (results) => resolve(results.data),
//         error: (error) => reject(error)
//       });
//     });
//   } catch (error) {
//     console.error('Error loading CSV:', error);
//     throw error;
//   }
// }