import { clearToken, getToken, redirectToLogin } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publishedYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  category: string;
  publishedYear?: string;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    }
  });

  if (response.status === 401) {
    clearToken();
    redirectToLogin();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function authHeaders(): Record<string, string> {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
}

export async function login(username: string, password: string) {
  return request<{ token: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export async function fetchBooks() {
  return request<{ books: Book[] }>("/api/books");
}

export async function createBook(input: BookInput) {
  return request<{ book: Book }>("/api/books", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input)
  });
}

export async function deleteBook(id: string) {
  return request<void>(`/api/books/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
}
