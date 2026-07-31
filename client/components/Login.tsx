"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { login } from "../lib/api";
import { setToken } from "../lib/auth";

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(searchParams.get("message") ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("กรุณากรอก username และ password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { token } = await login(trimmedUsername, trimmedPassword);
      setToken(token);
      router.replace("/");
    } catch (requestError) {
      setError(
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
              Personal Library
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
              Book Library
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              เข้าสู่ระบบเพื่อเพิ่ม ลบ และดูคลังหนังสือส่วนตัวของคุณจากฐานข้อมูลจริง
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

            {error ? (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <label className="mt-6 block text-sm font-medium text-neutral-700">
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                autoComplete="username"
                aria-invalid={Boolean(error && !username.trim())}
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-neutral-700">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                autoComplete="current-password"
                aria-invalid={Boolean(error && !password.trim())}
              />
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

