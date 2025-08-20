// src/components/ProtectedRoute.tsx
import { type ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string; // default redirect if not logged in
}

export default function ProtectedRoute({
  children,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate(redirectTo, { replace: true });
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        await supabase.auth.signOut();
        navigate(redirectTo, { replace: true });
        return;
      }

      setLoading(false); // valid session → render children
    };

    checkAuth();
  }, [navigate, redirectTo]);

  if (loading) return null; // you can replace with a spinner

  return <>{children}</>;
}
