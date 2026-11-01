import { API_URL } from "./constants";

// Kunci penyimpanan sesi login di localStorage
export const TOKEN_KEY = "ruangRasaToken";
export const USER_KEY = "ruangRasaUser";

// Semua request ke backend lewat fungsi ini, supaya token JWT otomatis ikut terkirim
// dan format balasan backend ({ success, message, data }) diolah di satu tempat.
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}/api${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Tidak bisa terhubung ke server. Coba lagi sebentar, server mungkin sedang dinyalakan."
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    // Token sudah tidak berlaku (kedaluwarsa atau dihapus). Kabari AuthContext supaya user di-logout.
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event("ruangrasa:sesi-habis"));
    }

    const error = new Error(
      result.message || `Request gagal (status ${response.status}).`
    );
    error.status = response.status;
    throw error;
  }

  return result.data;
}
