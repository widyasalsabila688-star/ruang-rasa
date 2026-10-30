
import { Link } from "react-router-dom";

export default function AdminUsers() {
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
        <p className="admin-label">USER MANAGEMENT</p>
        <h1>Manage Users</h1>
        <p>Kelola informasi dan data pengguna Ruang Rasa.</p>

        <section className="admin-table-section">
          <div className="admin-table-heading">
            <h2>Daftar Pengguna</h2>
            <span>Data Pengguna</span>
          </div>

          <div className="admin-empty">
            <p>Belum ada data pengguna.</p>
            <span>
              Data pengguna akan ditampilkan setelah frontend
              terhubung dengan backend.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
