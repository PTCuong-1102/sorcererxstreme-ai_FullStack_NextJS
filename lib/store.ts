
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  birthDate?: string;
  birthTime?: string;
  isProfileComplete: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  completeProfile: (name: string, birthDate: string, birthTime: string, token: string) => Promise<void>;
  updateProfile: (name: string, birthDate: string, birthTime: string, token: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, password: string) => {
        console.log('login called');
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          console.log('login response:', response.status);

          if (!response.ok) {
            return false;
          }

          const { token, user } = await response.json();
          console.log('login user:', user);
          document.cookie = `token=${token}; path=/; max-age=604800;`; // 7 days
          const isProfileComplete = !!(user.name && user.birthDate && user.birthTime);
          console.log('isProfileComplete:', isProfileComplete);
          set({ user: { ...user, isProfileComplete }, isAuthenticated: true, token });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      register: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return false;
          }

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      completeProfile: async (name: string, birthDate: string, birthTime: string, token: string) => {
        console.log('completeProfile called');
        if (token) {
          try {
            const response = await fetch('/api/profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name, birthDate, birthTime }),
            });
            console.log('completeProfile response:', response.status);

            if (response.ok) {
              const updatedUser = await response.json();
              console.log('completeProfile updatedUser:', updatedUser);
              set({ user: { ...get().user, ...updatedUser, isProfileComplete: true } });
            }
          } catch (error) {
            console.error(error);
          }
        }
      },

      updateProfile: async (name: string, birthDate: string, birthTime: string, token: string) => {
        if (token) {
          try {
            const response = await fetch('/api/profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name, birthDate, birthTime }),
            });

            if (response.ok) {
              const user = await response.json();
              set({ user });
            }
          } catch (error) {
            console.error(error);
          }
        }
      },

      logout: () => {
        document.cookie = 'token=; path=/; max-age=0';
        set({ user: null, isAuthenticated: false, token: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'tarot' | 'astrology' | 'numerology';
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading })
}));

export interface Partner {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  relationship: 'married' | 'dating' | 'interested';
  startDate: string;
}

export interface PartnerFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  relationship: 'married' | 'dating' | 'interested';
}

export interface BreakupData {
  id?: string;
  isActive: boolean;
  partnerName: string;
  partnerInfo?: Partner;
  breakupDate: string;
  autoDeleteDate: string;
  weeklyCheckDone: boolean[];
}

interface ProfileState {
  partner: Partner | null;
  breakupData: BreakupData | null;
  isLoading: boolean;
  error: string | null;
  
  // API methods
  fetchPartner: () => Promise<void>;
  fetchBreakupData: () => Promise<void>;
  addPartner: (partnerData: PartnerFormData) => Promise<boolean>;
  updatePartner: (partnerData: Partial<PartnerFormData>) => Promise<boolean>;
  breakup: () => Promise<boolean>;
  confirmRecovery: () => Promise<boolean>;
  restorePartner: (partnerInfo: Partner) => Promise<boolean>;
  updateWeeklyCheck: (weeklyCheckDone: boolean[]) => Promise<boolean>;
  
  // Utility methods
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}
// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner: null,
      breakupData: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Fetch partner from database
      fetchPartner: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch('/api/partner', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const partner = await response.json();
            set({ partner: partner || null, isLoading: false });
          } else {
            set({ partner: null, isLoading: false });
          }
        } catch (error) {
          console.error('Error fetching partner:', error);
          set({ error: 'Failed to fetch partner data', isLoading: false });
        }
      },

      // Fetch breakup data from database
      fetchBreakupData: async () => {
        try {
          const token = getAuthToken();
          if (!token) return;

          const response = await fetch('/api/breakup', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const breakupData = await response.json();
            set({ breakupData });
          } else {
            set({ breakupData: null });
          }
        } catch (error) {
          console.error('Error fetching breakup data:', error);
        }
      },

      // Add new partner to database
      addPartner: async (partnerData: PartnerFormData) => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          console.log('Client: Token found:', token ? 'Yes' : 'No');
          console.log('Client: Token preview:', token?.substring(0, 20) + '...');
          if (!token) {
            throw new Error('No authentication token');
          }

          console.log('Client: Sending request to /api/partner');
          console.log('Client: Request body:', JSON.stringify(partnerData));
          
          const response = await fetch('/api/partner', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(partnerData),
          });

          console.log('Client: Response status:', response.status);
          console.log('Client: Response ok:', response.ok);
          
          if (response.ok) {
            const newPartner = await response.json();
            console.log('Client: New partner created:', newPartner);
            set({ 
              partner: newPartner, 
              breakupData: null, 
              isLoading: false 
            });
            return true;
          } else {
            const errorData = await response.json();
            console.log('Client: Error response:', errorData);
            set({ 
              error: errorData.message || 'Failed to add partner', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error adding partner:', error);
          set({ error: 'Failed to add partner', isLoading: false });
          return false;
        }
      },

      // Update partner in database
      updatePartner: async (partnerData: Partial<PartnerFormData>) => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch('/api/partner', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(partnerData),
          });

          if (response.ok) {
            const updatedPartner = await response.json();
            set({ partner: updatedPartner, isLoading: false });
            return true;
          } else {
            const errorData = await response.json();
            set({ 
              error: errorData.message || 'Failed to update partner', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error updating partner:', error);
          set({ error: 'Failed to update partner', isLoading: false });
          return false;
        }
      },

      // Delete partner and create breakup record
      breakup: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const { partner } = get();
          if (!partner) {
            set({ error: 'No partner to break up with', isLoading: false });
            return false;
          }

          const response = await fetch('/api/partner', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const { breakupData } = await response.json();
            set({ 
              partner: null, 
              breakupData, 
              isLoading: false 
            });
            return true;
          } else {
            const errorData = await response.json();
            set({ 
              error: errorData.message || 'Failed to process breakup', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error processing breakup:', error);
          set({ error: 'Failed to process breakup', isLoading: false });
          return false;
        }
      },

      // Confirm recovery - delete breakup record from database
      confirmRecovery: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch('/api/breakup', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ isRecovered: true }),
          });

          if (response.ok) {
            set({ breakupData: null, isLoading: false });
            return true;
          } else {
            const errorData = await response.json();
            set({ 
              error: errorData.message || 'Failed to confirm recovery', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error confirming recovery:', error);
          set({ error: 'Failed to confirm recovery', isLoading: false });
          return false;
        }
      },

      // Restore partner from breakup data
      restorePartner: async (partnerInfo: Partner) => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch('/api/breakup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              restorePartner: { partnerInfo } 
            }),
          });

          if (response.ok) {
            const { partner } = await response.json();
            set({ 
              partner, 
              breakupData: null, 
              isLoading: false 
            });
            return true;
          } else {
            const errorData = await response.json();
            set({ 
              error: errorData.message || 'Failed to restore partner', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error restoring partner:', error);
          set({ error: 'Failed to restore partner', isLoading: false });
          return false;
        }
      },

      // Update weekly check status
      updateWeeklyCheck: async (weeklyCheckDone: boolean[]) => {
        set({ isLoading: true, error: null });
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch('/api/breakup', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ weeklyCheckDone }),
          });

          if (response.ok) {
            const updatedBreakupData = await response.json();
            set({ 
              breakupData: updatedBreakupData, 
              isLoading: false 
            });
            return true;
          } else {
            const errorData = await response.json();
            set({ 
              error: errorData.message || 'Failed to update weekly check', 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Error updating weekly check:', error);
          set({ error: 'Failed to update weekly check', isLoading: false });
          return false;
        }
      }
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ 
        partner: state.partner, 
        breakupData: state.breakupData 
      }),
    }
  )
);
