import { PrismaClient } from "@prisma/client";
import type { Taxonomy, User, Post } from "@prisma/client";
const prisma = new PrismaClient();

async function addTaxonomy(): Promise<Taxonomy | undefined> {
  const englishName = "bald eagle";
  const taxonomy = await prisma.taxonomy.findFirst({ where: { englishName } });
  if (taxonomy) {
    return;
  }
  return await prisma.taxonomy.create({
    data: {
      taxonomy: "bald-eagle",
      englishName: "bald eagle",
      isApproved: true,
      ancestors: [],
      rank: "species",
      imageUrl: "/public/eagle.jpeg",
      info: "some random info, just because",
    },
  });
}
async function addUser(): Promise<User | undefined> {
  const username = "johndoe";
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    return;
  }
  return await prisma.user.create({
    data: {
      username: "johndoe",
      password: "abc123",
      role: "user",
    },
  });
}
async function addPost(): Promise<Post | undefined> {
  return await prisma.post.create({
    data: {
      username: "johndoe",
      title: "Dummy Post",
      body: "This is just the simple post",
    },
  });
}

async function main() {
  const taxonomy = await addTaxonomy();
  const user = await addUser();
  const post = await addPost();

  return { taxonomy, user, post };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
