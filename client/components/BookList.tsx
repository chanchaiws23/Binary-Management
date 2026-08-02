"use client";

import { Trash2 } from "lucide-react";
import type { Book } from "../lib/api";

interface BookListProps {
  books: Book[];
  onDelete: (book: Book) => Promise<void>;
}

export function BookList({ books, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-600">
        ยังไม่มีหนังสือในคลัง
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-200">
      {books.map((book) => (
        <article
          key={book.id}
          className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <h3 className="text-xl font-semibold text-ink">{book.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {book.author} · {book.category}
              {book.publishedYear ? ` · ${book.publishedYear}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void onDelete(book)}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            aria-label={`ลบ ${book.title}`}
          >
            <Trash2 size={16} aria-hidden />
            ลบ
          </button>
        </article>
      ))}
    </div>
  );
}
