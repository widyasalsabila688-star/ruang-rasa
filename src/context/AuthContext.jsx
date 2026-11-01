import { useEffect, useState } from "react";
import { apiRequest, TOKEN_KEY, USER_KEY } from "../api";
import { trackEvent } from "../analytics";
import { AuthContext } from "./useAuth";

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  // Kalau ada token dari kunjungan sebelumnya, cek dulu ke backend apakah masih berlaku.
  // Selama pengecekan, halaman yang diproteksi jangan buru-buru melempar ke halaman login.
  const [checking, setChecking] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  function saveSession(token, userData) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  useEffect(() => {
    // Dipanggil dari api.js kalau backend membalas 401 (token sudah tidak berlaku)
    window.addEventListener("ruangrasa:sesi-habis", logout);

    if (localStorage.getItem(TOKEN_KEY)) {
      apiRequest("/auth/me")
        .then((freshUser) => {
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          setUser(freshUser);
        })
        .catch(() => {
          // 401 sudah ditangani lewat event di atas. Error lain (server tidur) dibiarkan,
          // user tetap dianggap login dengan data yang tersimpan.
        })
        .finally(() => setChecking(false));
    }

    return () => window.removeEventListener("ruangrasa:sesi-habis", logout);
  }, []);

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data.token, data.user);
    trackEvent("login", { method: "email" });
    return data.user;
  }

  async function register({ name, email, phone, password }) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });
    saveSession(data.token, data.user);
    trackEvent("sign_up", { method: "email" });
    return data.user;
  }

  const value = {
    user,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === "admin",
    checking,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
