
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateCredits: (amount: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Local Storage Fallback Logic ---
  const saveToLocal = (u: User) => localStorage.setItem('rapgen_user', JSON.stringify(u));
  const getFromLocal = (): User | null => {
    const data = localStorage.getItem('rapgen_user');
    return data ? JSON.parse(data) : null;
  };
  const clearLocal = () => localStorage.removeItem('rapgen_user');
  // ------------------------------------

  // Fetch user profile from 'profiles' table (Supabase Mode)
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch warning (using auth metadata):', error.message);
        // Fallback to minimal user info if profile table fails but auth succeeded
        setUser({
            id: userId,
            email: email,
            name: email.split('@')[0],
            credits: 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });
        return;
      }

      if (data) {
        const userData: User = {
          id: userId,
          email: email,
          name: data.full_name || 'کاربر',
          credits: data.credits || 0,
          avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.full_name}`
        };
        setUser(userData);
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Try Local Storage first (fastest)
      const localUser = getFromLocal();
      if (localUser && !isSupabaseConfigured) {
         setUser(localUser);
         setLoading(false);
         return;
      }

      // 2. Try Supabase if configured
      if (isSupabaseConfigured) {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (session?.user) {
                await fetchProfile(session.user.id, session.user.email!);
            } else if (localUser) {
                // If Supabase has no session but we have local user (maybe from demo mode), keep it
                setUser(localUser);
            }
          } catch (error: any) {
            console.warn("Supabase connection failed, falling back to local/demo mode:", error.message);
            if (localUser) setUser(localUser);
          }
      } else {
        // Not configured, stick with local if present
         if (localUser) setUser(localUser);
      }
      
      setLoading(false);

      // Listen for auth changes only if configured
      if (isSupabaseConfigured) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
               await fetchProfile(session.user.id, session.user.email!);
            } else if (event === 'SIGNED_OUT') {
               setUser(null);
               clearLocal();
            }
          });
          return () => subscription.unsubscribe();
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    // Fallback Mode
    if (!isSupabaseConfigured) {
       await new Promise(r => setTimeout(r, 800)); // Sim delay
       const localUser = getFromLocal();
       if (localUser && localUser.email === email) {
           setUser(localUser);
           return;
       }
       // Demo login if no previous user
       const demoUser: User = {
           id: 'demo-' + Math.random().toString(36).substr(2,9),
           email,
           name: email.split('@')[0],
           credits: 50,
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
       };
       setUser(demoUser);
       saveToLocal(demoUser);
       return;
    }

    // Supabase Mode
    try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) throw error;
    } catch (error: any) {
        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
            console.error("Network error, switching to demo login");
            // Network error fallback
            const demoUser: User = {
               id: 'offline-' + Math.random().toString(36).substr(2,9),
               email,
               name: email.split('@')[0],
               credits: 50,
               avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            setUser(demoUser);
            saveToLocal(demoUser);
            return;
        }
        if (error.message.includes('Invalid login credentials')) {
            throw new Error('ایمیل یا رمز عبور اشتباه است.');
        }
        throw new Error(error.message);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    // Fallback Mode
    if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 800));
        const newUser: User = {
           id: 'demo-' + Math.random().toString(36).substr(2,9),
           email,
           name,
           credits: 100,
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        setUser(newUser);
        saveToLocal(newUser);
        return;
    }

    // Supabase Mode
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name } },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Manual profile creation attempt
          const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
          try {
              await supabase.from('profiles').insert([
                { id: authData.user.id, full_name: name, credits: 100, avatar_url: avatarUrl }
              ]);
          } catch(e) { console.warn("Profile creation skipped/failed", e); }

          if (authData.session) {
             await fetchProfile(authData.user.id, email);
          } else {
             // Forcing a "logged in" state for UX if email confirmation is required but we want to show success
             // In real app, you might show "Check Email" message instead.
             throw new Error("ثبت نام انجام شد. اگر ایمیل تایید نیاز است، لطفاً اینباکس خود را چک کنید.");
          }
        }
    } catch (error: any) {
        if (error.message.includes('Failed to fetch')) {
             console.error("Network error, switching to demo signup");
             const demoUser: User = {
               id: 'offline-' + Math.random().toString(36).substr(2,9),
               email,
               name,
               credits: 100,
               avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            };
            setUser(demoUser);
            saveToLocal(demoUser);
            return;
        }
        throw new Error(error.message);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
        try { await supabase.auth.signOut(); } catch(e) { console.warn(e); }
    }
    setUser(null);
    clearLocal();
  };

  const updateCredits = async (amount: number) => {
    if (!user) return;
    const newBalance = Math.max(0, user.credits + amount);
    
    // Optimistic Update
    const updatedUser = { ...user, credits: newBalance };
    setUser(updatedUser);
    saveToLocal(updatedUser); // Update local copy

    if (isSupabaseConfigured && !user.id.startsWith('demo-') && !user.id.startsWith('offline-')) {
        const { error } = await supabase
          .from('profiles')
          .update({ credits: newBalance })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating credits on server:', error);
          // Note: In a strict app we might revert, but for UX we keep optimistic update here
        }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateCredits, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
