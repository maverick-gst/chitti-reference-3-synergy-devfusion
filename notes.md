


npm install @prisma/client and npm install prisma --save-dev

npx prisma generate --schema=./prisma/schema-mongo.prisma
npx prisma generate --schema=./prisma/schema-psql.prisma


npx prisma db push --schema=./prisma/schema-mongo.prisma
npx prisma db push --schema=./prisma/schema-psql.prisma

npx prisma studio --schema=./prisma/schema-mongo.prisma
npx prisma studio --schema=./prisma/schema-psql.prisma