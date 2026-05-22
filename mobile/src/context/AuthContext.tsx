import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  user: { admin_id: number; username: string; role: string } | null;
}

interface AuthContextType extends AuthState {
  signIn: (token: string, user: AuthState["user"]) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isLoggedIn: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("access_token");
      const userStr = await AsyncStorage.getItem("user");
      if (token && userStr) {
        setState({
          isLoading: false,
          isLoggedIn: true,
          token,
          user: JSON.parse(userStr),
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const signIn = useCallback(async (token: string, user: AuthState["user"]) => {
    await AsyncStorage.setItem("access_token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setState({ isLoading: false, isLoggedIn: true, token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("user");
    setState({ isLoading: false, isLoggedIn: false, token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
