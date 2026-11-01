import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

// Sidebar admin dipakai bersama oleh semua halaman admin
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>RUANG RASA</h2>
        <p className="admin-label">ADMIN PANEL</p>

        <nav>
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products">Manage Products</NavLink>
          <NavLink to="/admin/users">Manage Users</NavLink>
          <NavLink to="/admin/orders">Manage Orders</NavLink>
        </nav>

        <div className="admin-account">
          <span>Login sebagai</span>
          <strong>{user?.name}</strong>
          <button type="button" onClick={handleLogout}>
            Keluar
          </button>
        </div>

        <Link to="/" className="admin-back">
          ← Kembali ke Website
        </Link>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
