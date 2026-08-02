"use client";

import { FormEvent, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { BookInput } from "../lib/api";
import { showErrorAlert } from "../lib/sweetAlert";

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
  const authorInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<BookInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof BookInput, string>>
  >({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentYear = new Date().getFullYear();
    const trimmedForm = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      publishedYear: form.publishedYear?.trim() ?? ""
    };

    const validationErrors: Partial<Record<keyof BookInput, string>> = {};

    if (!trimmedForm.title) {
      validationErrors.title = "กรุณากรอกชื่อหนังสือ";
    }

    if (!trimmedForm.author) {
      validationErrors.author = "กรุณากรอกชื่อผู้แต่ง";
    }

    if (!trimmedForm.category) {
      validationErrors.category = "กรุณากรอกหมวดหมู่";
    }

    if (
      trimmedForm.publishedYear &&
      (!Number.isInteger(Number(trimmedForm.publishedYear)) ||
        Number(trimmedForm.publishedYear) < 0 ||
        Number(trimmedForm.publishedYear) > currentYear)
    ) {
      validationErrors.publishedYear =
        `ปีที่พิมพ์ต้องเป็นเลขจำนวนเต็มตั้งแต่ 0 ถึง ${currentYear}`;
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);

      if (validationErrors.title) titleInputRef.current?.focus();
      else if (validationErrors.author) authorInputRef.current?.focus();
      else if (validationErrors.category) categoryInputRef.current?.focus();
      else yearInputRef.current?.focus();

      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await onCreate(trimmedForm);
      setForm(initialForm);
      titleInputRef.current?.focus();
    } catch (requestError) {
      await showErrorAlert(
        "เพิ่มหนังสือไม่สำเร็จ",
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถเพิ่มหนังสือได้"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="border-b border-neutral-200 pb-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-neutral-700">
          ชื่อหนังสือ
          <input
            ref={titleInputRef}
            value={form.title}
            onChange={(event) => {
              setForm((current) => ({ ...current, title: event.target.value }));
              setFieldErrors((current) => ({ ...current, title: undefined }));
            }}
            className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
              fieldErrors.title
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-neutral-300 focus:border-accent focus:ring-accent/20"
            }`}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
          />
          {fieldErrors.title ? (
            <span id="title-error" className="mt-1.5 block text-sm text-red-700">
              {fieldErrors.title}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-medium text-neutral-700">
          ผู้แต่ง
          <input
            ref={authorInputRef}
            value={form.author}
            onChange={(event) => {
              setForm((current) => ({ ...current, author: event.target.value }));
              setFieldErrors((current) => ({ ...current, author: undefined }));
            }}
            className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
              fieldErrors.author
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-neutral-300 focus:border-accent focus:ring-accent/20"
            }`}
            aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={fieldErrors.author ? "author-error" : undefined}
          />
          {fieldErrors.author ? (
            <span id="author-error" className="mt-1.5 block text-sm text-red-700">
              {fieldErrors.author}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-medium text-neutral-700">
          หมวดหมู่
          <input
            ref={categoryInputRef}
            value={form.category}
            onChange={(event) => {
              setForm((current) => ({ ...current, category: event.target.value }));
              setFieldErrors((current) => ({ ...current, category: undefined }));
            }}
            className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
              fieldErrors.category
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-neutral-300 focus:border-accent focus:ring-accent/20"
            }`}
            aria-invalid={Boolean(fieldErrors.category)}
            aria-describedby={fieldErrors.category ? "category-error" : undefined}
          />
          {fieldErrors.category ? (
            <span id="category-error" className="mt-1.5 block text-sm text-red-700">
              {fieldErrors.category}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-medium text-neutral-700">
          ปีที่พิมพ์
          <input
            ref={yearInputRef}
            value={form.publishedYear}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                publishedYear: event.target.value
              }));
              setFieldErrors((current) => ({
                ...current,
                publishedYear: undefined
              }));
            }}
            type="number"
            min="0"
            max={new Date().getFullYear()}
            className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
              fieldErrors.publishedYear
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-neutral-300 focus:border-accent focus:ring-accent/20"
            }`}
            aria-invalid={Boolean(fieldErrors.publishedYear)}
            aria-describedby={
              fieldErrors.publishedYear ? "published-year-error" : undefined
            }
          />
          {fieldErrors.publishedYear ? (
            <span
              id="published-year-error"
              className="mt-1.5 block text-sm text-red-700"
            >
              {fieldErrors.publishedYear}
            </span>
          ) : null}
        </label>
      </div>

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
