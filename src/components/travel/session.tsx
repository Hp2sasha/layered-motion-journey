import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const SessionContext = createContext<{ user: User | null; signOut: () => Promise<void> }>({ user: null, signOut: async () => {} });
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient(); const router = useRouter(); const navigate = useNavigate();
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => { if (alive) setUser(data.user); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
      setUser(session?.user ?? null); router.invalidate();
      if (event !== 'SIGNED_OUT') queryClient.invalidateQueries();
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);
  const signOut = async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); setUser(null); await navigate({ to: '/auth', replace: true }); };
  return <SessionContext.Provider value={{ user, signOut }}>{children}</SessionContext.Provider>;
}
export const useSession = () => useContext(SessionContext);