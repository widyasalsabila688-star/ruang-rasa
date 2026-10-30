
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Nasi Goreng Kampung", category: "Makanan Utama", price: 22000 },
  { id: 2, name: "Nasi Ayam Sambal Matah", category: "Makanan Utama", price: 25000 },
  { id: 3, name: "Nasi Ayam Mentega", category: "Makanan Utama", price: 25000 },
  { id: 4, name: "Tahu Gejrot", category: "Camilan", price: 15000 },
  { id: 5, name: "Pisang Goreng", category: "Camilan", price: 15000 },
  { id: 6, name: "Bakwan Jagung", category: "Camilan", price: 12000 },
  { id: 7, name: "Cendol Dawet", category: "Dessert", price: 15000 },
  { id: 8, name: "Klepon", category: "Dessert", price: 12000 },
  { id: 9, name: "Es Teh Manis", category: "Minuman", price: 7000 },
  { id: 10, name: "Kopi Susu Gula Aren", category: "Minuman", price: 18000 },
  { id: 11, name: "Air Mineral", category: "Minuman", price: 5000 },
];

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminProducts() {
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
        <p className="admin-label">PRODUCT MANAGEMENT</p>
        <h1>Manage Products</h1>
        <p>Kelola daftar menu dan produk Ruang Rasa.</p>

        <section className="admin-table-section">
          <div className="admin-table-heading">
            <h2>Daftar Produk</h2>
            <span>{products.length} Produk</span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{rupiah(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
