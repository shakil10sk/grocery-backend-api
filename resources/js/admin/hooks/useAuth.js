import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for authentication
 * Re-exports useAuth from AuthContext for convenience
 */
export const useAuth = useAuthContext;

export default useAuth;

