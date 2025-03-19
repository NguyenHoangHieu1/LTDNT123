import { create } from 'zustand';
import { supabase } from '../libs/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;

  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in',
        loading: false,
      });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        loading: false,
      });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      set({
        user: null,
        session: null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        loading: false,
      });
    }
  },

  refreshSession: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      set({
        user: data.session?.user || null,
        session: data.session,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to refresh session',
        loading: false,
      });
    }
  },
}));
