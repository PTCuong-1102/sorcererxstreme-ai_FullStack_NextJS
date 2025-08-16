
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

export interface BreakupData {
  isActive: boolean;
  partnerName: string;
  partnerInfo: Partner;
  breakupDate: string;
  autoDeleteDate: string;
  weeklyCheckDone: boolean[];
}

interface ProfileState {
  partner: Partner | null;
  breakupData: BreakupData | null;
  addPartner: (partnerData: Omit<Partner, 'id' | 'startDate'>) => void;
  updatePartner: (partnerData: Partial<Partner>) => void;
  breakup: () => void;
  confirmRecovery: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      partner: null,
      breakupData: null,

      addPartner: (partnerData) => {
        const newPartner: Partner = {
          ...partnerData,
          id: Date.now().toString(),
          startDate: new Date().toISOString()
        };
        set({ partner: newPartner, breakupData: null });
      },

      updatePartner: (partnerData) => {
        const { partner } = get();
        if (partner) {
          set({ partner: { ...partner, ...partnerData } });
        }
      },

      breakup: () => {
        const { partner } = get();
        if (partner) {
          const breakupDate = new Date();
          const autoDeleteDate = new Date(breakupDate);
          autoDeleteDate.setMonth(autoDeleteDate.getMonth() + 1); // Thay đổi từ 3 tháng thành 1 tháng

          const breakupData: BreakupData = {
            isActive: true,
            partnerName: partner.name,
            partnerInfo: partner,
            breakupDate: breakupDate.toISOString(),
            autoDeleteDate: autoDeleteDate.toISOString(),
            weeklyCheckDone: []
          };

          set({ partner: null, breakupData });

          // Tự động xóa sau 1 tháng
          setTimeout(() => {
            const { breakupData: currentBreakupData } = get();
            if (currentBreakupData && currentBreakupData.isActive) {
              set({ breakupData: null });
            }
          }, 30 * 24 * 60 * 60 * 1000); // 1 tháng
        }
      },

      confirmRecovery: () => {
        set({ breakupData: null });
      }
    }),
    {
      name: 'profile-storage'
    }
  )
);
