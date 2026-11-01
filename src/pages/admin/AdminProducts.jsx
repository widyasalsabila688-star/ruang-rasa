import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { rupiah } from "../../utils/format";
import AdminLayout from "./AdminLayout";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/products")
      .then((data) => setProducts(Array.isArray(data) ? data : data?.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <p className="admin-label">PRODUCT MANAGEMENT</p>
      <h1>Manage Products</h1>
      <p>Kelola daftar menu dan produk Ruang Rasa.</p>

      <section className="admin-table-section">
        <div className="admin-table-heading">
          <h2>Daftar Produk</h2>
          <span>{products.length} Produk</span>
        </div>

        {loading && <p className="empty-message">Memuat produk...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
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
        )}
      </section>
    </AdminLayout>
  );
}
