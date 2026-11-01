// Google Analytics 4. Baru aktif kalau VITE_GA_MEASUREMENT_ID diisi (di Vercel: Environment Variables).
// Perpindahan halaman (page_view) sudah dicatat otomatis oleh GA4, jadi tidak perlu dikirim manual.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initAnalytics() {
  if (!GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

// Event seperti login, sign_up, dan purchase otomatis dikenali dashboard GA4
export function trackEvent(name, params = {}) {
  window.gtag?.("event", name, params);
}
