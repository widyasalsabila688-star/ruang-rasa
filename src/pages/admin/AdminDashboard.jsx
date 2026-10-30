
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>RUANG RASA</h2>
        <p className="admin-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/orders">Manage Orders</Link>
        </nav>

        <Link to="/" className="admin-back">
          ← Kembali ke Website
        </Link>
      </aside>

      <main className="admin-content">
        <p className="admin-label">OVERVIEW</p>
        <h1>Dashboard</h1>
        <p>Selamat datang di Admin Panel Ruang Rasa.</p>

        <div className="admin-stats">
          <div className="admin-card">
            <span>Total Produk</span>
            <h2>11</h2>
          </div>

          <div className="admin-card">
            <span>Total Pengguna</span>
            <h2>0</h2>
          </div>

          <div className="admin-card">
            <span>Total Pesanan</span>
            <h2>0</h2>
          </div>
        </div>

        <section className="admin-welcome">
          <h2>Selamat Bekerja!</h2>
          <p>
            Kelola produk, pengguna, dan pesanan Ruang Rasa
            melalui halaman administrasi ini.
          </p>
        </section>
      </main>
    </div>
  );
}
