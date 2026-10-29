
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./App.css";

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

const products = [
  {
    id: 1,
    name: "Nasi Goreng Kampung",
    category: "Makanan Utama",
    price: 22000,
    image: "/nasi-goreng-kampung.jpg",
    description: "Nasi goreng berbumbu khas dengan rasa gurih.",
  },
  {
    id: 2,
    name: "Nasi Ayam Sambal Matah",
    category: "Makanan Utama",
    price: 25000,
    image: heroImage,
    description:
      "Nasi hangat dengan ayam gurih dan sambal matah segar.",
  },
  {
    id: 3,
    name: "Nasi Ayam Mentega",
    category: "Makanan Utama",
    price: 25000,
    image: "/nasi-ayam-mentega.jpg",
    description: "Ayam saus mentega gurih disajikan dengan nasi hangat.",
  },
  {
    id: 4,
    name: "Tahu Gejrot",
    category: "Camilan",
    price: 15000,
    image: "/tahu-gejrot.jpg",
    description: "Tahu dengan kuah asam manis pedas khas.",
  },
  {
    id: 5,
    name: "Pisang Goreng",
    category: "Camilan",
    price: 15000,
    image: "/pisang-goreng.jpg",
    description: "Pisang goreng hangat dengan tekstur renyah.",
  },
  {
    id: 6,
    name: "Bakwan Jagung",
    category: "Camilan",
    price: 12000,
    image: "/bakwan-jagung.jpg",
    description: "Bakwan jagung gurih dan renyah.",
  },
  {
    id: 7,
    name: "Cendol Dawet",
    category: "Dessert",
    price: 15000,
    image: "/cendol-dawet.jpg",
    description: "Cendol segar dengan santan dan gula aren.",
  },
  {
    id: 8,
    name: "Klepon",
    category: "Dessert",
    price: 12000,
    image: "/klepon.jpg",
    description:
      "Kue tradisional berisi gula merah dengan balutan kelapa.",
  },
  {
    id: 9,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 7000,
    image: "/es-teh-manis.jpg",
    description: "Teh manis dingin yang menyegarkan.",
  },
  {
    id: 10,
    name: "Kopi Susu Gula Aren",
    category: "Minuman",
    price: 18000,
    image: "/kopi-susu-gula-aren.jpg",
    description: "Perpaduan kopi, susu, dan gula aren.",
  },
  {
    id: 11,
    name: "Air Mineral",
    category: "Minuman",
    price: 5000,
    image: "/air-mineral.jpg",
    description: "Air mineral untuk menemani hidanganmu.",
  },
];

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function Header({ cartCount }) {
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

      <Link to="/keranjang" className="nav-button">
        Keranjang ({cartCount})
      </Link>
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
          <p className="eyebrow">
            RESTORAN · INDONESIAN COMFORT FOOD
          </p>

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

function MenuPage({ onAdd }) {
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

      <div className="simple-product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="empty-message">Menu belum ditemukan.</p>
      )}
    </main>
  );
}

function DetailPage({ onAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(id));

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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [success, setSuccess] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function submitOrder(event) {
    event.preventDefault();

    if (!cart.length) return;

    onClearCart();
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="simple-page checkout-success">
        <p className="eyebrow">RUANG RASA</p>
        <h1>Terima kasih, {name}!</h1>
        <p>Pesanan kamu berhasil dibuat.</p>

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
          Simpan informasi pesanan ini sebagai referensi. Sistem saat ini
          belum mengirim pesanan ke restoran secara langsung.
        </p>

        <Link to="/menu" className="primary-button">
          Kembali ke Menu
        </Link>
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

          <button className="primary-button" type="submit">
            Buat Pesanan
          </button>
        </form>
      )}
    </main>
  );
}

function Website() {
  const [cart, setCart] = useState([]);

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
      <Header cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage onAdd={addToCart} />} />

        <Route
          path="/produk/:id"
          element={<DetailPage onAdd={addToCart} />}
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
            <CheckoutPage
              cart={cart}
              onClearCart={() => setCart([])}
            />
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

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Website />
    </BrowserRouter>
  );
}
