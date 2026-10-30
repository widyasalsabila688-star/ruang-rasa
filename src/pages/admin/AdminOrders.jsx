
import { Link } from "react-router-dom";

export default function AdminOrders() {
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
        <p className="admin-label">ORDER MANAGEMENT</p>
        <h1>Manage Orders</h1>
        <p>Pantau dan kelola pesanan pelanggan Ruang Rasa.</p>

        <section className="admin-table-section">
          <div className="admin-table-heading">
            <h2>Daftar Pesanan</h2>
            <span>Data Pesanan</span>
          </div>

          <div className="admin-empty">
            <p>Belum ada data pesanan.</p>
            <span>
              Data pesanan akan ditampilkan setelah frontend
              terhubung dengan backend.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
