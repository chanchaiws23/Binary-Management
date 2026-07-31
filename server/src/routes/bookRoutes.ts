import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { prisma } from "../config/db.js";

export const bookRouter = Router();

bookRouter.get("/books", async (_req, res) => {
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return res.json({ books });
});

bookRouter.post("/books", authMiddleware, async (req, res) => {
  const { title, author, category, publishedYear } = req.body as {
    title?: string;
    author?: string;
    category?: string;
    publishedYear?: number | string;
  };

  if (!title || !author || !category) {
    return res
      .status(400)
      .json({ error: "Title, author, and category are required" });
  }

  const parsedPublishedYear =
    publishedYear === undefined || publishedYear === ""
      ? null
      : Number(publishedYear);

  if (
    parsedPublishedYear !== null &&
    (!Number.isInteger(parsedPublishedYear) || parsedPublishedYear < 0)
  ) {
    return res.status(400).json({ error: "Published year must be a valid year" });
  }

  const book = await prisma.book.create({
    data: {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      publishedYear: parsedPublishedYear
    }
  });

  return res.status(201).json({ book });
});

bookRouter.delete("/books/:id", authMiddleware, async (req, res) => {
  const id = String(req.params.id);

  const existingBook = await prisma.book.findUnique({
    where: { id }
  });

  if (!existingBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  await prisma.book.delete({
    where: { id }
  });

  return res.status(204).send();
});
