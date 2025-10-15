import { useAuthStore } from "../slices/auth";

/**
 * Memoized selectors for auth store
 * Use these instead of directly accessing store for better performance
 */

export const useUser = () => useAuthStore((state) => state.user);

export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);

export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === "admin");

export const useIsStaff = () =>
  useAuthStore((state) => state.user?.role === "staff" || state.user?.role === "admin");

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

export const useAuthError = () => useAuthStore((state) => state.error);

export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    logout: state.logout,
  }));

