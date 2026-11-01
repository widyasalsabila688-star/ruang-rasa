
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../constants";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal.");
      }

      const { token, user } = result.data;

      if (user.role !== "admin") {
        throw new Error("Akun ini bukan akun admin.");
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="simple-page">
      <section className="simple-checkout">
        <p className="eyebrow">RUANG RASA · ADMIN</p>
        <h1 className="page-title">Admin Login.</h1>
        <p className="page-intro">
          Masuk untuk mengelola restoran Ruang Rasa.
        </p>

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password admin"
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="page-intro">
          <Link to="/">← Kembali ke Website</Link>
        </p>
      </section>
    </main>
  );
}
