"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import { BookForm } from "../components/BookForm";
import { BookList } from "../components/BookList";
import {
  Book,
  BookInput,
  createBook,
  deleteBook,
  fetchBooks
} from "../lib/api";
import { clearToken, getToken } from "../lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const previousBookCount = useRef<number | null>(null);

  const totalBooks = useMemo(() => books.length, [books]);
  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort(),
    [books]
  );

  async function loadBooks() {
    setLoading(true);
    setError("");

    try {
      const payload = await fetchBooks();
      setBooks(payload.books);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถโหลดรายการหนังสือได้"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace(
        `/login?message=${encodeURIComponent("กรุณาเข้าสู่ระบบก่อนใช้งาน")}`
      );
      return;
    }

    void loadBooks();
  }, [router]);

  useEffect(() => {
    if (previousBookCount.current === null) {
      previousBookCount.current = books.length;
      return;
    }

    if (!actionMessage || previousBookCount.current === books.length) {
      previousBookCount.current = books.length;
      return;
    }

    window.alert(actionMessage);
    previousBookCount.current = books.length;
    setActionMessage("");
  }, [actionMessage, books]);

  async function handleCreateBook(input: BookInput) {
    const payload = await createBook(input);
    setActionMessage("เพิ่มหนังสือเรียบร้อยแล้วนะ!");
    setBooks((current) => [payload.book, ...current]);
  }

  async function handleDeleteBook(id: string) {
    await deleteBook(id);
    setActionMessage("ลบหนังสือเรียบร้อยแล้วนะ!");
    setBooks((current) => current.filter((book) => book.id !== id));
  }

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen px-6 py-8 text-ink">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Personal Book Library
            </p>
            <h1 className="mt-3 text-4xl font-semibold md:text-6xl">
              คลังหนังสือส่วนตัว
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-700">
              จัดการหนังสือจากฐานข้อมูล PostgreSQL พร้อม JWT authentication
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadBooks()}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 font-semibold transition hover:bg-neutral-50"
            >
              <RefreshCw size={18} aria-hidden />
              รีเฟรช
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent/90"
            >
              <LogOut size={18} aria-hidden />
              ออกจากระบบ
            </button>
          </div>
        </header>

        <section className="grid gap-6 py-6 md:grid-cols-2">
          <div className="border-b border-neutral-200 pb-5 md:border-b-0 md:border-r md:pr-6">
            <p className="text-sm text-neutral-600">หนังสือทั้งหมด</p>
            <p className="mt-2 text-5xl font-semibold">{totalBooks}</p>
          </div>
          <div className="pb-5 md:pl-2">
            <p className="text-sm text-neutral-600">หมวดหมู่</p>
            <p className="mt-3 text-lg font-medium">
              {categories.length ? categories.join(", ") : "ยังไม่มีหมวดหมู่"}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm">
          <BookForm onCreate={handleCreateBook} />

          <div className="pt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">รายการหนังสือ</h2>
              {loading ? (
                <span className="text-sm text-neutral-500">กำลังโหลด...</span>
              ) : null}
            </div>

            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {!loading && !error ? (
              <BookList books={books} onDelete={handleDeleteBook} />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

