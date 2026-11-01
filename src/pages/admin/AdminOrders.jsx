import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { formatDate, ORDER_STATUS, rupiah } from "../../utils/format";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    apiRequest("/orders")
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(orderId, status) {
    setUpdatingId(orderId);
    setError("");
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    } catch (err) {
      setError(`Gagal mengubah status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout>
      <p className="admin-label">ORDER MANAGEMENT</p>
      <h1>Manage Orders</h1>
      <p>Pantau dan kelola pesanan pelanggan Ruang Rasa.</p>

      <section className="admin-table-section">
        <div className="admin-table-heading">
          <h2>Daftar Pesanan</h2>
          <span>{orders.length} Pesanan</span>
        </div>

        {loading && <p className="empty-message">Memuat pesanan...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && orders.length === 0 && !error && (
          <div className="admin-empty">
            <p>Belum ada data pesanan.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Menu</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <br />
                      <small>{formatDate(order.createdAt)}</small>
                    </td>
                    <td>
                      {order.customerName}
                      <br />
                      <small>
                        {order.phone} ·{" "}
                        {order.orderType === "dine-in" ? "Dine In" : "Take Away"} ·{" "}
                        {order.paymentMethod === "qris" ? "QRIS" : "Cash"}
                      </small>
                    </td>
                    <td>
                      {order.items?.map((item, index) => (
                        <div key={index}>
                          {item.quantity}× {item.name}
                        </div>
                      ))}
                    </td>
                    <td>{rupiah(order.total)}</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(event) => changeStatus(order.id, event.target.value)}
                      >
                        {Object.entries(ORDER_STATUS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
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
