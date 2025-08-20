// src/components/RedirectIfAuth.tsx
import { type ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface RedirectIfAuthProps {
  children: ReactNode;
  redirectTo?: string; // default to dashboard
}

export default function RedirectIfAuth({
  children,
  redirectTo = "/dashboard",
}: RedirectIfAuthProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate(redirectTo, { replace: true });
      } else {
        setLoading(false); // show the landing page
      }
    };

    checkSession();
  }, [navigate, redirectTo]);

  if (loading) return null; // or spinner

  return <>{children}</>;
}
