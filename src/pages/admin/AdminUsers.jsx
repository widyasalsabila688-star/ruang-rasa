import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { formatDate } from "../../utils/format";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/users")
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <p className="admin-label">USER MANAGEMENT</p>
      <h1>Manage Users</h1>
      <p>Kelola informasi dan data pengguna Ruang Rasa.</p>

      <section className="admin-table-section">
        <div className="admin-table-heading">
          <h2>Daftar Pengguna</h2>
          <span>{users.length} Pengguna</span>
        </div>

        {loading && <p className="empty-message">Memuat pengguna...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <div className="admin-empty">
            <p>Belum ada data pengguna.</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Telepon</th>
                  <th>Role</th>
                  <th>Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <span className={`role-badge ${user.role === "admin" ? "role-admin" : ""}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
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
