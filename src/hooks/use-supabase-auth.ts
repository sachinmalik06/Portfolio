import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);

      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else if (error) {
        console.error('Error loading user profile:', error);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Email OTP flow
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Allow new users to be created
        }
      });
      if (error) throw error;
      return data;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If the error is about a missing session, we can treat it as a successful sign out
        // because the user is effectively signed out anyway.
        if (error.message.includes('session') || error.message.includes('missing')) {
          console.warn('Sign out completed with session warning:', error.message);
          return;
        }
        throw error;
      }
    } catch (err: any) {
      // Catch any network or internal errors during sign out
      if (err?.message?.includes('session') || err?.message?.includes('missing')) {
        console.warn('Sign out suppressed session error:', err.message);
        return;
      }
      console.error('Sign out failed:', err);
      throw err;
    }
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    isAdmin: profile?.is_admin ?? false,
  };
}

