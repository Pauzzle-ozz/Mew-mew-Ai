import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/**
 * Hook personnalisé pour l'authentification
 * Gère la vérification de l'utilisateur et la redirection
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (!user) {
          router.push('/login');
        } else {
          setUser(user);
        }
      } catch (err) {
        if (isMounted) {
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { user, loading };
}
