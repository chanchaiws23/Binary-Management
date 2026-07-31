"use client";

import { FormEvent, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { BookInput } from "../lib/api";

interface BookFormProps {
  onCreate: (input: BookInput) => Promise<void>;
}

const initialForm: BookInput = {
  title: "",
  author: "",
  category: "",
  publishedYear: ""
};

export function BookForm({ onCreate }: BookFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<BookInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onCreate(form);
      setForm(initialForm);
      titleInputRef.current?.focus();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถเพิ่มหนังสือได้"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-neutral-200 pb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-neutral-700">
          ชื่อหนังสือ
          <input
            ref={titleInputRef}
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            required
          />
        </label>

        <label className="text-sm font-medium text-neutral-700">
          ผู้แต่ง
          <input
            value={form.author}
            onChange={(event) =>
              setForm((current) => ({ ...current, author: event.target.value }))
            }
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            required
          />
        </label>

        <label className="text-sm font-medium text-neutral-700">
          หมวดหมู่
          <input
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            required
          />
        </label>

        <label className="text-sm font-medium text-neutral-700">
          ปีที่พิมพ์
          <input
            value={form.publishedYear}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                publishedYear: event.target.value
              }))
            }
            type="number"
            min="0"
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus size={18} aria-hidden />
        {loading ? "กำลังเพิ่ม..." : "เพิ่มหนังสือ"}
      </button>
    </form>
  );
}

