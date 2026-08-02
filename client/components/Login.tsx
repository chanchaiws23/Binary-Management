"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { login } from "../lib/api";
import { setToken } from "../lib/auth";
import { showErrorAlert, showSuccessAlert } from "../lib/sweetAlert";

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message") ?? "";
  const initialMessageShownRef = useRef(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMessage && !initialMessageShownRef.current) {
      initialMessageShownRef.current = true;
      void showErrorAlert("ต้องเข้าสู่ระบบก่อน", initialMessage);
    }
  }, [initialMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const validationErrors: { username?: string; password?: string } = {};

    if (!trimmedUsername) validationErrors.username = "กรุณากรอก Username";
    if (!trimmedPassword) validationErrors.password = "กรุณากรอก Password";

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);

      if (validationErrors.username) usernameInputRef.current?.focus();
      else passwordInputRef.current?.focus();

      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      const { token } = await login(trimmedUsername, trimmedPassword);
      setToken(token);
      await showSuccessAlert("เข้าสู่ระบบสำเร็จ", "กำลังเข้าสู่คลังหนังสือ");
      router.replace("/");
    } catch (requestError) {
      await showErrorAlert(
        "เข้าสู่ระบบไม่สำเร็จ",
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถเข้าสู่ระบบได้"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <section className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Personal Book Library
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
              คลังหนังสือส่วนตัว
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              เข้าสู่ระบบเพื่อดูแลและจัดระเบียบหนังสือเล่มโปรดของคุณ
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="rounded-lg border border-neutral-200 bg-white/90 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">เข้าสู่ระบบ</h2>
            <p className="mt-2 text-sm text-neutral-600">
              ใช้บัญชีทดสอบ admin / password123
            </p>

            <label className="mt-6 block text-sm font-medium text-neutral-700">
              Username
              <input
                ref={usernameInputRef}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFieldErrors((current) => ({
                    ...current,
                    username: undefined
                  }));
                }}
                className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
                  fieldErrors.username
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-accent focus:ring-accent/20"
                }`}
                autoComplete="username"
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={
                  fieldErrors.username ? "username-error" : undefined
                }
              />
              {fieldErrors.username ? (
                <span
                  id="username-error"
                  className="mt-1.5 block text-sm text-red-700"
                >
                  {fieldErrors.username}
                </span>
              ) : null}
            </label>

            <label className="mt-4 block text-sm font-medium text-neutral-700">
              Password
              <input
                ref={passwordInputRef}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined
                  }));
                }}
                type="password"
                className={`mt-2 w-full rounded-md border bg-white px-3 py-3 outline-none transition focus:ring-2 ${
                  fieldErrors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-accent focus:ring-accent/20"
                }`}
                autoComplete="current-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
              />
              {fieldErrors.password ? (
                <span
                  id="password-error"
                  className="mt-1.5 block text-sm text-red-700"
                >
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} aria-hidden />
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
