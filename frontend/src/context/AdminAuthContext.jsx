import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSessionStatus } from "../api/admin.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, authenticated: false, admin: null });

  const refresh = useCallback(async () => {
    const result = await getSessionStatus();
    if (result.ok) {
      setState({ loading: false, authenticated: result.data.authenticated, admin: result.data.admin || null });
    } else {
      setState({ loading: false, authenticated: false, admin: null });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <AdminAuthContext.Provider value={{ ...state, refresh }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
