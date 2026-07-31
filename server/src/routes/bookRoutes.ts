import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { prisma } from "../config/db.js";
import { readOptionalYear, readRequiredString } from "../utils/validation.js";

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
  const { title, author, category, publishedYear } = req.body as Record<
    string,
    unknown
  >;
  const parsedTitle = readRequiredString(title, "Title", 160);
  const parsedAuthor = readRequiredString(author, "Author", 120);
  const parsedCategory = readRequiredString(category, "Category", 80);
  const parsedPublishedYear = readOptionalYear(publishedYear);

  if ("error" in parsedTitle) {
    return res.status(400).json({ error: parsedTitle.error });
  }

  if ("error" in parsedAuthor) {
    return res.status(400).json({ error: parsedAuthor.error });
  }

  if ("error" in parsedCategory) {
    return res.status(400).json({ error: parsedCategory.error });
  }

  if ("error" in parsedPublishedYear) {
    return res.status(400).json({ error: parsedPublishedYear.error });
  }

  const book = await prisma.book.create({
    data: {
      title: parsedTitle.value,
      author: parsedAuthor.value,
      category: parsedCategory.value,
      publishedYear: parsedPublishedYear.value ?? null
    }
  });

  return res.status(201).json({ book });
});

bookRouter.delete("/books/:id", authMiddleware, async (req, res) => {
  const id = String(req.params.id);

  if (!id.trim()) {
    return res.status(400).json({ error: "Book id is required" });
  }

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
