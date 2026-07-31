import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db.js";

async function main() {
  const password = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { password },
    create: {
      username: "admin",
      password
    }
  });

  const bookCount = await prisma.book.count();

  if (bookCount === 0) {
    await prisma.book.createMany({
      data: [
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          category: "Software",
          publishedYear: 2008
        },
        {
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt, David Thomas",
          category: "Software",
          publishedYear: 1999
        }
      ]
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

