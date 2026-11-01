export const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

// Status pesanan dari backend, ditampilkan dalam bahasa Indonesia
export const ORDER_STATUS = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  ready: "Siap",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};
