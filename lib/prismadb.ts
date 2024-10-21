import { PrismaClient as PrismaClient1 } from '../prisma/generated/mongo'
import { PrismaClient as PrismaClient2 } from '../prisma/generated/postgres'

declare global {
  var prisma_mongo: PrismaClient1 | undefined;
  var prisma_pg: PrismaClient2 | undefined;
}

const prisma_mongo = global.prisma_mongo || new PrismaClient1();
const prisma_pg = global.prisma_pg || new PrismaClient2();

if (process.env.NODE_ENV !== "production") {
  global.prisma_mongo = prisma_mongo;
  global.prisma_pg = prisma_pg;
}

const prismadb = {
  prisma_mongo,
  prisma_pg
};

export default prismadb;

