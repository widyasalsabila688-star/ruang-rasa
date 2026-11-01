import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Sama dengan aturan di aplikasi mobile & backend
const MIN_PASSWORD = 6;

export default function RegisterPage() {
  const { isLoggedIn, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/profil";

  if (isLoggedIn && !loading) {
    return <Navigate to="/profil" replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    // Cek ringan di browser dulu, aturan sebenarnya tetap dicek ulang oleh backend
    if (form.password.length < MIN_PASSWORD) {
      setError(`Password minimal ${MIN_PASSWORD} karakter.`);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password belum sama.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Registrasi gagal.");
      setLoading(false);
    }
  }

  return (
    <main className="simple-page auth-page">
      <p className="eyebrow">BERGABUNG BERSAMA KAMI</p>
      <h1 className="page-title">
        Daftar <em>akun baru.</em>
      </h1>
      <p className="page-intro">
        Buat akun untuk memesan menu favorit dan memantau status pesananmu.
      </p>

      <form className="simple-checkout" onSubmit={handleRegister}>
        <label>
          Nama lengkap
          <input
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            placeholder="Nama kamu"
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            placeholder="nama@email.com"
          />
        </label>

        <label>
          Nomor telepon
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={updateField}
            placeholder="08xxxxxxxxxx"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={updateField}
            placeholder={`Minimal ${MIN_PASSWORD} karakter`}
          />
        </label>

        <label>
          Ulangi password
          <input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={updateField}
            placeholder="Ketik ulang password"
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="auth-switch">
        Sudah punya akun?{" "}
        <Link to="/login" state={location.state}>
          Masuk di sini
        </Link>
      </p>
    </main>
  );
}
