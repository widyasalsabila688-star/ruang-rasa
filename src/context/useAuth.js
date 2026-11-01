import { createContext, useContext } from "react";

// Dipisah dari AuthContext.jsx supaya fast refresh Vite tetap jalan
// (file komponen sebaiknya hanya meng-export komponen).
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}
