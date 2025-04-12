import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.animeCollection.deleteMany();
  await prisma.anime.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      emailVerified: new Date(),
      image: 'men1.jpg',
    },
  });
  
  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      emailVerified: new Date(),
      image: 'women1.jpg',
    },
  });

  const anime1 = await prisma.anime.create({
    data: {
      title: 'Attack on Titan',
      description: 'A story about humanity fighting for survival against giant creatures.',
      year: 2013,
      genre: ['Action', 'Drama', 'Fantasy'],
      image: 'attack_on_titan.jpg',
    },
  });

  const anime2 = await prisma.anime.create({
    data: {
      title: 'Demon Slayer',
      description: 'A boy becomes a demon slayer to avenge his family and protect his sister.',
      year: 2019,
      genre: ['Action', 'Adventure', 'Supernatural'],
      image: 'demon_slayer.jpg',
    },
  });

  const anime3 = await prisma.anime.create({
    data: {
      title: 'Fullmetal Alchemist: Brotherhood',
      description: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their mother goes awry and leaves them in damaged physical forms.',
      year: 2009,
      genre: ['Action', 'Adventure', 'Drama'],
      image: 'fullmetal_alchemist_brotherhood.jpg',
    },
  });

  const anime4 = await prisma.anime.create({
    data: {
      title: 'One Punch Man',
      description: 'A superhero who can defeat any opponent with a single punch faces the monotony of being too powerful.',
      year: 2015,
      genre: ['Action', 'Adventure', 'Drama'],
      image: null,
    },
  });

  await prisma.animeCollection.create({
    data: {
      userId: user1.id,
      animeId: anime1.id,
      status: 'WATCHING',
      isFavorite: true,
      progress: 5,
    },
  });

  await prisma.animeCollection.create({
    data: {
      userId: user1.id,
      animeId: anime2.id,
      status: 'PLAN_TO_WATCH',
      isFavorite: false,
      progress: 0,
    },
  });

  await prisma.animeCollection.create({
    data: {
      userId: user1.id,
      animeId: anime3.id,
      status: 'WATCHED',
      isFavorite: true,
      progress: 64,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user1.id,
      animeId: anime1.id,
      value: 5,
    },
  });

  await prisma.rating.create({
    data: {
      userId: user2.id,
      animeId: anime2.id,
      value: 4,
    },
  });

  await prisma.comment.create({
    data: {
      userId: user1.id,
      animeId: anime1.id,
      text: 'One of the best anime ever! The plot is so intense.',
    },
  });

  await prisma.comment.create({
    data: {
      userId: user2.id,
      animeId: anime2.id,
      text: 'Demon Slayer is visually stunning and has great characters!',
    },
  });

  console.log('Seed data has been added.');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });