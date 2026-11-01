
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./App.css";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminLogin from "./pages/admin/AdminLogin";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { apiRequest } from "./api";
import { trackEvent } from "./analytics";
import { rupiah } from "./utils/format";
import { API_URL } from "./constants";

const heroImage = "/nasi-ayam-sambal-matah.jpg";

const categories = [
  {
    name: "Makanan Utama",
    description: "Hidangan hangat untuk mengisi hari.",
    image: "/nasi-goreng-kampung.jpg",
  },
  {
    name: "Camilan",
    description: "Teman kecil untuk setiap cerita.",
    image: "/pisang-goreng.jpg",
  },
  {
    name: "Dessert",
    description: "Manisnya momen setelah makan.",
    image: "/klepon.jpg",
  },
  {
    name: "Minuman",
    description: "Kesegaran untuk menemani suasana.",
    image: "/es-teh-manis.jpg",
  },
];

function Header({ cartCount }) {
  const { user, isLoggedIn } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        RUANG RASA<span className="brand-mark">®</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Beranda</Link>
        <Link to="/menu">Menu</Link>
        <a href="/#tentang-kami">Tentang Kami</a>
      </nav>

      <div className="nav-actions">
        {isLoggedIn ? (
          <Link to="/profil" className="nav-account">
            Hai, {(user.name || "Akun").split(" ")[0]}
          </Link>
        ) : (
          <Link to="/login" className="nav-account">
            Masuk
          </Link>
        )}

        <Link to="/keranjang" className="nav-button">
          Keranjang ({cartCount})
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="brand">
        RUANG RASA<span className="brand-mark">®</span>
      </Link>
      <span>Hidangan hangat, momen yang berarti.</span>
      <span>© 2026 Ruang Rasa. All rights reserved.</span>
    </footer>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="simple-product">
      <Link to={`/produk/${product.id}`} className="product-image-link">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = heroImage;
          }}
        />
      </Link>

      <div className="simple-product-body">
        <p className="product-category">{product.category}</p>

        <Link to={`/produk/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <p className="product-description">{product.description}</p>

        <div className="simple-product-bottom">
          <strong>{rupiah(product.price)}</strong>
          <button className="small-button" onClick={() => onAdd(product)}>
            + Keranjang
          </button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  return (
    <main className="website">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">RESTORAN · INDONESIAN COMFORT FOOD</p>

          <h1>
            Satu meja,
            <br />
            <em>banyak cerita.</em>
          </h1>

          <p className="hero-description">
            Hidangan khas Indonesia dengan cita rasa autentik, disajikan
            dalam suasana hangat untuk momen yang lebih bermakna.
          </p>

          <Link to="/menu" className="primary-button">
            Lihat Menu →
          </Link>

          <p className="hero-caption">
            HIDANGAN HANGAT. MOMEN YANG BERARTI.
          </p>
        </div>

        <div className="hero-image-wrap">
          <img
            className="hero-image"
            src={heroImage}
            alt="Nasi ayam sambal matah khas Ruang Rasa"
          />
        </div>
      </section>

      <section className="menu-section">
        <div className="menu-heading">
          <p className="eyebrow">02 / DARI DAPUR KAMI</p>
          <h2>
            Temukan rasa <em>favoritmu.</em>
          </h2>
          <p>
            Pilih kategori untuk menemukan hidangan yang ingin kamu nikmati.
          </p>
        </div>

        <div className="menu-preview">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/menu?category=${encodeURIComponent(category.name)}`}
              className="menu-card"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = heroImage;
                }}
              />

              <div className="menu-card-body">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="text-link">Lihat Menu →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section" id="tentang-kami">
        <div className="about-content">
          <p className="eyebrow">TENTANG KAMI</p>
          <h2>
            Bukan sekadar tempat
            <br />
            untuk <em>makan.</em>
          </h2>
          <p>
            Ruang Rasa adalah tempat menikmati hidangan khas Indonesia dalam
            suasana sederhana, hangat, dan nyaman.
          </p>
        </div>

        <div className="about-image-wrap">
          <img
            src="/resto-ruang-rasa.jpg"
            alt="Suasana restoran yang hangat dan nyaman"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}

function MenuPage({ onAdd, products, productsLoading, productsError }) {
  const [params, setParams] = useSearchParams();
  const selected = params.get("category") || "Semua";
  const [keyword, setKeyword] = useState("");

  const filtered = products.filter((product) => {
    const categoryMatch =
      selected === "Semua" || product.category === selected;

    const keywordMatch = product.name
      .toLowerCase()
      .includes(keyword.toLowerCase());

    return categoryMatch && keywordMatch;
  });

  return (
    <main className="simple-page">
      <p className="eyebrow">DARI DAPUR KAMI</p>

      <h1 className="page-title">
        Menu <em>Ruang Rasa.</em>
      </h1>

      <p className="page-intro">
        Temukan hidangan favorit untuk menemani harimu.
      </p>

      <input
        className="menu-search"
        type="search"
        placeholder="Cari menu, misalnya nasi goreng..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <div className="category-filters">
        {["Semua", ...categories.map((item) => item.name)].map((category) => (
          <button
            key={category}
            className={`filter-button ${
              selected === category ? "active" : ""
            }`}
            onClick={() =>
              setParams(category === "Semua" ? {} : { category })
            }
          >
            {category}
          </button>
        ))}
      </div>

      {productsLoading ? (
        <p className="empty-message">Memuat produk...</p>
      ) : productsError ? (
        <p className="empty-message">{productsError}</p>
      ) : (
        <div className="simple-product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}

      {!productsLoading && !productsError && filtered.length === 0 && (
        <p className="empty-message">Menu belum ditemukan.</p>
      )}
    </main>
  );
}

function DetailPage({ onAdd, products, productsLoading, productsError }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  if (productsLoading) {
    return (
      <main className="simple-page">
        <p>Memuat produk...</p>
      </main>
    );
  }

  if (productsError) {
    return (
      <main className="simple-page">
        <p>{productsError}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="simple-page">
        <h1>Menu tidak ditemukan.</h1>
        <Link to="/menu" className="primary-button">
          Kembali ke Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="simple-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Kembali
      </button>

      <section className="detail-simple">
        <img
          src={product.image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = heroImage;
          }}
        />

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <h2>{rupiah(product.price)}</h2>
          <p>{product.description}</p>

          <button
            className="primary-button"
            onClick={() => {
              onAdd(product);
              navigate("/keranjang");
            }}
          >
            Tambah ke Keranjang
          </button>
        </div>
      </section>
    </main>
  );
}

function CartPage({ cart, onQuantityChange, onRemove }) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="simple-page">
      <p className="eyebrow">PESANANMU</p>
      <h1 className="page-title">Keranjang.</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Keranjangmu masih kosong.</p>
          <Link to="/menu" className="primary-button">
            Jelajahi Menu →
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <article className="simple-cart-row" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = heroImage;
                  }}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{rupiah(item.price)}</p>

                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-button"
                  onClick={() => onRemove(item.id)}
                >
                  Hapus
                </button>
              </article>
            ))}
          </div>

          <div className="simple-total">
            <span>Total pesanan</span>
            <strong>{rupiah(total)}</strong>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/checkout")}
          >
            Lanjut ke Checkout →
          </button>
        </>
      )}
    </main>
  );
}

function CheckoutPage({ cart, onClearCart }) {
  const { user } = useAuth();

  // Nama dan telepon langsung terisi dari akun yang sedang login
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [orderType, setOrderType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function submitOrder(event) {
    event.preventDefault();

    if (!cart.length) return;

    setSubmitting(true);
    setError("");

    try {
      // Pesanan dikirim ke backend dan tersimpan di MongoDB, jadi bisa dipantau admin
      const created = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          orderType,
          paymentMethod,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          total,
        }),
      });

      trackEvent("purchase", {
        transaction_id: String(created?.id ?? ""),
        value: total,
        currency: "IDR",
        items: cart.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      setOrder(created || {});
      onClearCart();
    } catch (err) {
      setError(err.message || "Pesanan gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <main className="simple-page checkout-success">
        <p className="eyebrow">RUANG RASA</p>
        <h1>Terima kasih, {name}!</h1>
        <p>
          Pesanan{order.id ? ` #${order.id}` : ""} berhasil dibuat dan sudah
          diterima restoran.
        </p>

        <p className="page-intro">
          Metode pemesanan:{" "}
          {orderType === "dine-in" ? "Dine In" : "Take Away"}.
        </p>

        <p className="page-intro">
          Metode pembayaran:{" "}
          {paymentMethod === "qris"
            ? "QRIS (simulasi pembayaran)"
            : "Cash di kasir"}.
        </p>

        {orderType === "dine-in" ? (
          <p className="page-intro">
            Silakan datang ke restoran. Staf kami akan membantu menentukan
            meja. Jika memilih cash, lakukan pembayaran di kasir.
          </p>
        ) : (
          <p className="page-intro">
            Silakan ambil sendiri pesananmu di restoran. Estimasi pesanan
            siap adalah 20–30 menit setelah pembayaran.{" "}
            {paymentMethod === "cash"
              ? "Untuk pembayaran cash, silakan bayar terlebih dahulu di kasir."
              : "Pembayaran QRIS pada prototipe ini hanya simulasi."}
          </p>
        )}

        <p className="page-intro">
          Status pesanan bisa kamu pantau di halaman profil.
        </p>

        <div className="profile-actions">
          <Link to="/profil" className="primary-button">
            Lihat Status Pesanan
          </Link>
          <Link to="/menu" className="outline-button">
            Kembali ke Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="simple-page">
      <p className="eyebrow">SELANGKAH LAGI</p>
      <h1 className="page-title">Checkout.</h1>

      {!cart.length ? (
        <div className="empty-cart">
          <p>Keranjangmu masih kosong.</p>
          <Link to="/menu" className="primary-button">
            Pilih Menu →
          </Link>
        </div>
      ) : (
        <form className="simple-checkout" onSubmit={submitOrder}>
          <label>
            Nama lengkap
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama pemesan"
            />
          </label>

          <label>
            Nomor telepon
            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </label>

          <div>
            <p>
              <strong>Metode pemesanan</strong>
            </p>

            <div className="category-filters">
              <button
                type="button"
                className={`filter-button ${
                  orderType === "dine-in" ? "active" : ""
                }`}
                onClick={() => setOrderType("dine-in")}
              >
                Dine In
              </button>

              <button
                type="button"
                className={`filter-button ${
                  orderType === "take-away" ? "active" : ""
                }`}
                onClick={() => setOrderType("take-away")}
              >
                Take Away
              </button>
            </div>

            <p className="page-intro">
              {orderType === "dine-in"
                ? "Makan di tempat. Meja akan ditentukan oleh staf restoran saat kamu datang."
                : "Pesan sekarang dan ambil sendiri di restoran. Estimasi siap 20–30 menit setelah pembayaran."}
            </p>
          </div>

          <div>
            <p>
              <strong>Metode pembayaran</strong>
            </p>

            <div className="category-filters">
              <button
                type="button"
                className={`filter-button ${
                  paymentMethod === "qris" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("qris")}
              >
                QRIS
              </button>

              <button
                type="button"
                className={`filter-button ${
                  paymentMethod === "cash" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                Cash di Kasir
              </button>
            </div>

            <p className="page-intro">
              {paymentMethod === "qris"
                ? "Pembayaran QRIS dipresentasikan sebagai simulasi untuk prototipe ini. Belum ada transaksi sungguhan."
                : "Pembayaran dilakukan langsung di kasir restoran. Untuk Take Away, estimasi waktu siap dihitung setelah pembayaran."}
            </p>
          </div>

          {paymentMethod === "qris" && (
            <div>
              <p>
                <strong>Ringkasan pembayaran QRIS</strong>
              </p>
              <p className="page-intro">
                Total pembayaran: {rupiah(total)}
              </p>
            </div>
          )}

          <div className="simple-total">
            <span>Total pesanan</span>
            <strong>{rupiah(total)}</strong>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Mengirim pesanan..." : "Buat Pesanan"}
          </button>
        </form>
      )}
    </main>
  );
}

const CART_KEY = "ruangRasaCart";

function readSavedCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function Website() {
  // Keranjang disimpan di localStorage, jadi tidak hilang saat halaman di-refresh
  // atau saat pelanggan diarahkan ke halaman login sebelum checkout.
  const [cart, setCart] = useState(readSavedCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Mengambil data produk dari backend
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Setiap pindah halaman, mulai dari atas lagi (misalnya setelah login lanjut ke checkout)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data produk.");
        }

        const productData = Array.isArray(result.data)
          ? result.data
          : result.data?.products || [];

        setProducts(productData);
      } catch (error) {
        setProductsError(error.message || "Terjadi kesalahan koneksi API.");
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, quantity) {
    if (quantity < 1) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {!isAdmin && <Header cartCount={cartCount} />}

      <Routes>
        {/* ADMIN: semua halaman di bawah /admin hanya untuk role admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* AKUN */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<RegisterPage />} />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route path="/" element={<Home />} />

        <Route
          path="/menu"
          element={
            <MenuPage
              onAdd={addToCart}
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
            />
          }
        />

        <Route
          path="/produk/:id"
          element={
            <DetailPage
              onAdd={addToCart}
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
            />
          }
        />

        <Route
          path="/keranjang"
          element={
            <CartPage
              cart={cart}
              onQuantityChange={changeQuantity}
              onRemove={removeFromCart}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            // Checkout butuh login supaya pesanan tercatat di akun pelanggan
            <ProtectedRoute>
              <CheckoutPage
                cart={cart}
                onClearCart={() => setCart([])}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <main className="simple-page">
              <h1>Halaman tidak ditemukan.</h1>
              <Link to="/" className="primary-button">
                Kembali ke Beranda
              </Link>
            </main>
          }
        />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Website />
      </AuthProvider>
    </BrowserRouter>
  );
}
