import { supabase } from "../lib/supabaseClient";

// Sign up
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

// Sign in
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// Sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};
