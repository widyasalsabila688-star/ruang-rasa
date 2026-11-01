import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tiga data diambil bersamaan supaya dashboard lebih cepat tampil
    Promise.all([
      apiRequest("/products"),
      apiRequest("/users"),
      apiRequest("/orders"),
    ])
      .then(([products, users, orders]) =>
        setStats({
          products: products?.length ?? 0,
          users: users?.length ?? 0,
          orders: orders?.length ?? 0,
          pending: orders?.filter((order) => order.status === "pending").length ?? 0,
        })
      )
      .catch((err) => setError(err.message));
  }, []);

  const show = (value) => (stats ? value : "…");

  return (
    <AdminLayout>
      <p className="admin-label">OVERVIEW</p>
      <h1>Dashboard</h1>
      <p>Selamat datang di Admin Panel Ruang Rasa.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="admin-stats">
        <div className="admin-card">
          <span>Total Produk</span>
          <h2>{show(stats?.products)}</h2>
        </div>

        <div className="admin-card">
          <span>Total Pengguna</span>
          <h2>{show(stats?.users)}</h2>
        </div>

        <div className="admin-card">
          <span>Total Pesanan</span>
          <h2>{show(stats?.orders)}</h2>
        </div>
      </div>

      <section className="admin-welcome">
        <h2>Selamat Bekerja!</h2>
        <p>
          {stats?.pending
            ? `Ada ${stats.pending} pesanan yang menunggu dikonfirmasi. Cek di menu Manage Orders.`
            : "Kelola produk, pengguna, dan pesanan Ruang Rasa melalui halaman administrasi ini."}
        </p>
      </section>
    </AdminLayout>
  );
}
