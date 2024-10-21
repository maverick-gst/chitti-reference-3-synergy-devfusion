lest write a file  @create_all_tracks.ts  , which puts all data in mongoDB with schema @schema-mongo.prisma and uses @prismadb.ts  using @tracks_interfaces.ts 

add errorhandling and loggintoand catching error y=items for retry


---
npm install -D typescript ts-node @types/node

   npx ts-node scripts/create_all_tracks.ts

      npx tsc scripts/create_all_tracks.ts
   node scripts/create_all_tracks.js