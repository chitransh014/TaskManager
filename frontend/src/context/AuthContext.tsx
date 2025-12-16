import { createContext, useEffect, useState } from "react";
import { getProfileApi } from "../api/auth.api";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const user = await getProfileApi();
      setUser(user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await fetchProfile();
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
