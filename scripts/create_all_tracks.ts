// import { PrismaClient } from '@prisma/client';
// import { Track, SubTrack, Goal, Project, ProjectItem } from '../app/(protected)/tracks/interfaces/tracks_interfaces';
// import prismadb from '../lib/prismadb';

// const MAX_RETRIES = 3;
// const RETRY_DELAY = 1000; // 1 second

// const prisma = prismadb.prisma_mongo;

// async function createTrack(track: Track, retryCount = 0): Promise<void> {
//   try {
//     const createdTrack = await prisma.track.create({
//       data: {
//         name: track.name,
//         description: track.description,
//         color: track.color,
//         icon: track.icon,
//         subTracks: {
//           create: track.subTracks.map(subTrack => ({
//             name: subTrack.name,
//             description: subTrack.description,
//             goals: {
//               create: subTrack.goals?.map(goal => ({
//                 title: goal.title,
//                 description: goal.description,
//                 targetDate: goal.targetDate,
//                 status: goal.status,
//                 projects: {
//                   create: goal.projects?.map(project => ({
//                     name: project.name,
//                     description: project.description,
//                     startDate: project.startDate,
//                     endDate: project.endDate,
//                     priority: project.priority,
//                     items: {
//                       create: project.items?.map(item => ({
//                         title: item.title,
//                         type: item.type,
//                         deadline: 'deadline' in item ? item.deadline : undefined,
//                         date: 'date' in item ? item.date : undefined,
//                       }))
//                     }
//                   }))
//                 }
//               }))
//             }
//           }))
//         }
//       }
//     });
//     console.log(`Created track: ${createdTrack.name}`);
//   } catch (error) {
//     console.error(`Error creating track ${track.name}:`, error);
//     if (retryCount < MAX_RETRIES) {
//       console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
//       await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
//       await createTrack(track, retryCount + 1);
//     } else {
//       console.error(`Failed to create track ${track.name} after ${MAX_RETRIES} retries.`);
//     }
//   }
// }

// async function createAllTracks(tracks: Track[]): Promise<void> {
//   for (const track of tracks) {
//     await createTrack(track);
//   }
// }

// import { original_tracks } from './original-data copy';

// // Main function to run the script
// async function main() {
//   try {
//     console.log('Starting to create tracks...');
//     await createAllTracks(original_tracks);
//     console.log('All tracks created successfully!');
//   } catch (error) {
//     console.error('Error in main function:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();