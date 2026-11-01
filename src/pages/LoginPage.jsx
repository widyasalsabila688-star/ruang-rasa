import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Halaman yang tadi mau dibuka sebelum diminta login (dikirim oleh ProtectedRoute)
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/";

  if (isLoggedIn && !loading) {
    return <Navigate to="/profil" replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal.");
      setLoading(false);
    }
  }

  return (
    <main className="simple-page auth-page">
      <p className="eyebrow">SELAMAT DATANG KEMBALI</p>
      <h1 className="page-title">
        Masuk ke <em>akun.</em>
      </h1>
      <p className="page-intro">
        {from
          ? "Silakan masuk dulu untuk melanjutkan pesananmu."
          : "Masuk untuk memesan dan melihat riwayat pesananmu."}
      </p>

      <form className="simple-checkout" onSubmit={handleLogin}>
        <label>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="auth-switch">
        Belum punya akun?{" "}
        <Link to="/daftar" state={location.state}>
          Daftar sekarang
        </Link>
      </p>
    </main>
  );
}
