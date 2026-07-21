import { prisma } from './src/config/prisma';

async function main() {
  const movies = await prisma.movie.findMany();
  console.log("Movies muc:", movies.map(m => m.muc));
  
  const nodes = await prisma.chapterNode.findMany();
  console.log("Nodes muc:", nodes.map(n => n.muc));
  await prisma.$disconnect();
}

main().catch(console.error);
