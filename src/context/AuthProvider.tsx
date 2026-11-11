import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getProfile } from '../lib/dataService';
import { supabase } from '../lib/supabase';
import {
  endLocalTestSession,
  isLocalTestLoginEnabled,
  restoreLocalTestSession,
  startLocalTestSession,
} from '../lib/localTestMode';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getProfile>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const profileLoadId = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setUser(restoreLocalTestSession());
      setIsLoading(false);
      return;
    }

    let active = true;
    const restoreProfile = async (userId: string | null) => {
      const requestId = ++profileLoadId.current;
      if (!userId) {
        if (active && requestId === profileLoadId.current) {
          setUser(null);
          setAuthError(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const profile = await getProfile(userId);
        if (active && requestId === profileLoadId.current) {
          setUser(profile);
          setAuthError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Unable to load the authenticated account profile.', error);
        if (active && requestId === profileLoadId.current) {
          setUser(null);
          setAuthError(error instanceof Error ? error.message : 'Unable to load your account profile.');
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void restoreProfile(session?.user.id ?? null);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        throw error;
      }
      return restoreProfile(data.session?.user.id ?? null);
    }).catch((error: unknown) => {
      console.error('Unable to restore the Supabase session.', error);
      if (active) {
        setAuthError(error instanceof Error ? error.message : 'Unable to restore the Supabase session.');
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      login: async (email: string, password: string) => {
        if (!supabase) {
          throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw new Error(error.message);
        }

        const profile = await getProfile(data.user.id);
        setUser(profile);
        setAuthError(null);
      },
      loginAsLocalTestEnumerator: async () => {
        if (!isLocalTestLoginEnabled) {
          throw new Error('Temporary local sign-in is not enabled.');
        }
        setUser(startLocalTestSession());
        setAuthError(null);
      },
      acceptInvitation: async (invitationId: string) => {
        if (!supabase) {
          throw new Error('Supabase is not configured.');
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw new Error('The invitation session could not be verified.');
        }
        if (!session) {
          throw new Error('The invitation link is invalid or has expired. Open the link from your invitation email again.');
        }

        const { data, error } = await supabase.rpc('accept_user_invitation', {
          target_invitation_id: invitationId,
        });
        if (error || data !== true) {
          throw new Error('This invitation cannot be accepted. It may have been cancelled or already used.');
        }

        const profile = await getProfile(session.user.id);
        profileLoadId.current += 1;
        setUser(profile);
        setAuthError(null);
      },
      logout: async () => {
        if (!supabase) {
          endLocalTestSession();
          setUser(null);
          setAuthError(null);
          return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }

        setUser(null);
        setAuthError(null);
      },
    }),
    [user, isLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
