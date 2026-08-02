"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw, Search } from "lucide-react";
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
import {
  showConfirmAlert,
  showErrorAlert,
  showInfoAlert,
  showSuccessAlert,
  showToast
} from "../lib/sweetAlert";

// ref: 37aa88161f
export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const bookChangeRef = useRef<"added" | "deleted" | null>(null);

  const totalBooks = useMemo(() => books.length, [books]);
  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort(),
    [books]
  );
  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) =>
      [book.title, book.author, book.category, book.publishedYear]
        .filter((value) => value !== null)
        .some((value) =>
          String(value).toLocaleLowerCase().includes(normalizedQuery)
        )
    );
  }, [books, searchQuery]);

  async function loadBooks(showSuccess = false) {
    setLoading(true);
    setError("");

    try {
      const payload = await fetchBooks();
      setBooks(payload.books);

      if (showSuccess) {
        void showToast("โหลดรายการหนังสือเรียบร้อยแล้ว");
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถโหลดรายการหนังสือได้";

      setError(message);
      await showErrorAlert("โหลดข้อมูลไม่สำเร็จ", message);
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
    const change = bookChangeRef.current;

    if (!change) {
      return;
    }

    bookChangeRef.current = null;

    if (change === "added") {
      void showSuccessAlert(
        "เพิ่มหนังสือสำเร็จ",
        "หนังสือถูกบันทึกเข้าคลังแล้ว"
      );
      return;
    }

    void showSuccessAlert("ลบหนังสือสำเร็จ", "นำหนังสือออกจากคลังแล้ว");
  }, [books]);

  async function handleCreateBook(input: BookInput) {
    const payload = await createBook(input);
    bookChangeRef.current = "added";
    setBooks((current) => [payload.book, ...current]);
  }

  async function handleDeleteBook(book: Book) {
    const confirmed = await showConfirmAlert(
      "ยืนยันการลบหนังสือ",
      `ต้องการลบ “${book.title}” ออกจากคลังหรือไม่`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBook(book.id);
      bookChangeRef.current = "deleted";
      setBooks((current) =>
        current.filter((currentBook) => currentBook.id !== book.id)
      );
    } catch (requestError) {
      await showErrorAlert(
        "ลบหนังสือไม่สำเร็จ",
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถลบหนังสือได้"
      );
    }
  }

  async function handleLogout() {
    clearToken();
    await showInfoAlert("ออกจากระบบแล้ว");
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
              onClick={() => void loadBooks(true)}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-3 font-semibold transition hover:bg-neutral-50"
            >
              <RefreshCw size={18} aria-hidden />
              รีเฟรช
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
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
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">รายการหนังสือ</h2>
                {!loading && searchQuery.trim() ? (
                  <p className="mt-1 text-sm text-neutral-500">
                    พบ {filteredBooks.length} จาก {totalBooks} รายการ
                  </p>
                ) : null}
              </div>

              <label className="relative block w-full sm:max-w-sm">
                <span className="sr-only">ค้นหาหนังสือ</span>
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="ค้นหาชื่อ ผู้แต่ง หมวดหมู่ หรือปี"
                  className="w-full rounded-md border border-neutral-300 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-500">กำลังโหลด...</p>
            ) : null}

            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {!loading && !error ? (
              <BookList books={filteredBooks} onDelete={handleDeleteBook} />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
