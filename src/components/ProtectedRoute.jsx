import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Pembungkus halaman yang butuh login.
//   <ProtectedRoute>            -> cukup sudah login (pelanggan maupun admin)
//   <ProtectedRoute adminOnly>  -> harus login sebagai admin
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <main className="simple-page">
        <p className="empty-message">Memeriksa sesi login...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    // Setelah login, user dikembalikan ke halaman yang tadi mau dibuka
    return (
      <Navigate
        to={adminOnly ? "/admin/login" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <main className="simple-page">
        <p className="eyebrow">AKSES DITOLAK</p>
        <h1 className="page-title">Khusus admin.</h1>
        <p className="page-intro">
          Akunmu tidak punya akses ke halaman ini.
        </p>
        <Link to="/" className="primary-button">
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  return children;
}
