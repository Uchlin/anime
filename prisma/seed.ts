import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.animeCollection.deleteMany();
  await prisma.anime.deleteMany();
  await prisma.user.deleteMany();
  const user1 = await prisma.user.create({
    data: {
      name: 'Ян Непомнящий',
      email: 'ian@example.com',
      emailVerified: new Date(),
      image: 'man1.jpg',
    },
  });
  
  const user2 = await prisma.user.create({
    data: {
      name: 'Владислав Артемьев',
      email: 'vlad@example.com',
      emailVerified: new Date(),
      image: 'man2.jpg',
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: 'Дина Беленькая ',
      email: 'dan@example.com',
      emailVerified: new Date(),
      image: 'man3.jpg',
    },
  });
  const user4 = await prisma.user.create({
    data: {
      name: 'Мария Иванова',
      email: 'maria@example.com',
      emailVerified: new Date(),
      image: 'woman1.jpg',
    },
  });
  const anime1 = await prisma.anime.create({
    data: {
      title: 'Атака титанов',
      description: `Давным-давно человечество было всего-лишь «их» кормом, до тех пор, пока оно не построило гигантскую стену вокруг своей страны. 
С тех пор прошло сто лет мира и большинство людей жили счастливой, беззаботной жизнью. 
Но за долгие годы спокойствия пришлось заплатить огромную цену, и в 845 году они снова познали чувство ужаса и беспомощности — стена, которая была их единственным спасением, пала. 
«Они» прорвались. Половина человечества съедена, треть территории навсегда потеряна...
Для тех, кого волнует будет ли продолжение — на ивентовом показе 25 серии Титанов в Японии авторский состав, присутствующий там, сказал, что заинтересован в съёмках продолжения. 
Но в самое ближайшее время этого, увы, не предвидится! То есть, скорее всего, продолжение будет, но не ранее, чем в 2015 году или и того позже.`,
      year: 2013,
      genre: ['приключение', 'фэнтези', 'боевик'],
      image: 'attack_on_titan.jpg',
    },
  });

  const anime2 = await prisma.anime.create({
    data: {
      title: 'Клинок, рассекающий демонов',
      description: `Действие происходит в эпоху Тайсё. Ещё с древних времён ходят слухи о том, что в лесу обитают человекоподобные демоны,
которые питаются людьми и ходят по ночам, ища новую жертву. Но... это же просто легенда, ведь так?.. Танджиро Камадо — старший сын в семье,
потерявший своего отца и взявший на себя заботу о своих родных. Однажды он уходит в соседний город, чтобы продать древесный уголь.
Вернувшись утром, парень обнаруживает перед собой страшную картину: вся родня была зверски убита,
а единственной выжившей является Нэзуко — обращённая в демона, но пока не потерявшая всю человечность младшая сестра.
С этого момента для Танджиро и Нэзуко начинается долгое и опасное путешествие, в котором мальчик намерен разыскать убийцу и узнать способ исцеления для своей сестры.
Но в состоянии ли дети преодолеть все трудности и вернуться домой?`,
      year: 2019,
      genre: ['приключение', 'исторический', 'сверхъестественное'],
      image: 'demon_slayer.jpg',
    },
  });

  const anime3 = await prisma.anime.create({
    data: {
      title: 'Стальной алхимик:Братство',
      description: `Они нарушили основной закон алхимии и жестоко за это поплатились.
И теперь два брата странствуют по миру в поисках загадочного философского камня, который поможет им исправить содеянное...
Это мир, в котором вместо науки властвует магия, в котором люди способны управлять стихиями. Но у магии тоже есть законы, которым нужно следовать.
В противном случае расплата будет жестокой и страшной. Два брата - Эдвард и Альфонс Элрики - пытаются совершить запретное: воскресить умершую мать.
Однако закон равноценного обмена гласит: чтобы что-то получить, ты должен отдать нечто равноценное...`,
      year: 2009,
      genre: ['приключение', 'фэнтези', 'драма','сёнэн'],
      image: 'fullmetal_alchemist_brotherhood.jpg',
    },
  });

  const anime4 = await prisma.anime.create({
    data: {
      title: 'Ванпанчмен',
      description: `История повествует о юноше по имени Саитама, который живет в мире, иронично похожем на наш.
Ему 25, он лыс и прекрасен, к тому же, силен настолько, что с одного удара аннигилирует все опасности для человечества.
Он ищет себя на нелегком жизненном пути,попутно раздавая подзатыльники монстрам и злодеям.`,
      year: 2015,
      genre: ['боевик', 'фэнтези', 'приключение','повседневность','комедия','фантастика'],
      image: 'one_punch_man.jpg',
    },
  });
  const anime5 = await prisma.anime.create({
    data: {
      title: 'Сверхкуб',
      description: `В результате несчастного случая обычный мальчик Ван Сяосю получает космическую систему под названием «суперсиловой куб»
от высокоширотной космической цивилизации и обретает необычайные способности"`,
      year: 2025,
      genre: ['экшен', 'приключение', 'фэнтези'],
      image: 'sverhkub.jpg',
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
  await prisma.animeCollection.create({
    data: {
      userId: user2.id,
      animeId: anime4.id,
      status: 'WATCHING',
      isFavorite: false,
      progress: 12,
    },
  });
  
  await prisma.animeCollection.create({
    data: {
      userId: user4.id,
      animeId: anime5.id,
      status: 'PLAN_TO_WATCH',
      isFavorite: true,
      progress: 0,
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
  await prisma.rating.create({
    data: {
      userId: user2.id,
      animeId: anime3.id,
      value: 3,
    },
  });
  
  await prisma.rating.create({
    data: {
      userId: user3.id,
      animeId: anime4.id,
      value: 2,
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
  await prisma.comment.create({
    data: {
      userId: user3.id,
      animeId: anime3.id,
      text: 'Эта история потрясающая, персонажи очень глубоки!',
    },
  });
  
  await prisma.comment.create({
    data: {
      userId: user3.id,
      animeId: anime4.id,
      text: 'Юмор в этом аниме на высоте!',
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