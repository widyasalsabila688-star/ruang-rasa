import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function AdminLogin() {
  const { isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  if (isAdmin && !loading) {
    return <Navigate to={from} replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // Akun pelanggan biasa tidak boleh masuk ke panel admin
      if (user.role !== "admin") {
        logout();
        throw new Error("Akun ini bukan akun admin.");
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <main className="simple-page auth-page">
      <p className="eyebrow">RUANG RASA · ADMIN</p>
      <h1 className="page-title">Admin Login.</h1>
      <p className="page-intro">Masuk untuk mengelola restoran Ruang Rasa.</p>

      <form className="simple-checkout" onSubmit={handleLogin}>
        <label>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email admin"
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
            placeholder="Password admin"
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        <Link to="/">← Kembali ke Website</Link>
      </p>
    </main>
  );
}
