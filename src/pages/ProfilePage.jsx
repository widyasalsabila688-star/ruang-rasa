import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiRequest } from "../api";
import { formatDate, ORDER_STATUS, rupiah } from "../utils/format";

// Halaman khusus user yang sudah login (dibungkus ProtectedRoute di App.jsx)
export default function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/orders/me")
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="simple-page">
      <p className="eyebrow">AKUN PENGGUNA</p>
      <h1 className="page-title">
        Profil <em>saya.</em>
      </h1>

      <section className="profile-card">
        <span className="profile-avatar">
          {(user.name || "U").charAt(0).toUpperCase()}
        </span>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          {user.phone && <p>{user.phone}</p>}
          <span className="role-badge">
            {isAdmin ? "Administrator" : "Pelanggan"}
          </span>
        </div>
      </section>

      <div className="profile-actions">
        {isAdmin && (
          <Link to="/admin" className="primary-button">
            Masuk ke Admin Panel
          </Link>
        )}
        <button className="outline-button" type="button" onClick={handleLogout}>
          Keluar dari Akun
        </button>
      </div>

      <h2 className="section-title">Riwayat pesanan</h2>

      {loading && <p className="empty-message">Memuat riwayat pesanan...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-cart">
          <p>Belum ada pesanan.</p>
          <Link to="/menu" className="primary-button">
            Pesan Sekarang →
          </Link>
        </div>
      )}

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id || order._id}>
            <div className="order-card-head">
              <div>
                <strong>Pesanan #{order.id || order._id}</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <span className={`status-badge status-${order.status}`}>
                {ORDER_STATUS[order.status] || order.status}
              </span>
            </div>

            <ul>
              {order.items?.map((item, index) => (
                <li key={index}>
                  {item.quantity}× {item.name}
                </li>
              ))}
            </ul>

            <div className="order-card-foot">
              <span>
                {order.orderType === "dine-in" ? "Dine In" : "Take Away"} ·{" "}
                {order.paymentMethod === "qris" ? "QRIS" : "Cash"}
              </span>
              <strong>{rupiah(order.total)}</strong>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
