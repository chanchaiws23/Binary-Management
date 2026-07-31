const TOKEN_KEY = "book_library_token";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function redirectToLogin(message = "กรุณาเข้าสู่ระบบก่อนใช้งาน") {
  clearToken();
  window.location.href = `/login?message=${encodeURIComponent(message)}`;
}

