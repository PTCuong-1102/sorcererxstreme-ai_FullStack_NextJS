'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { useProfileStore } from '../store';

/**
 * Hook to sync partner and breakup data from database when user is authenticated
 * This ensures data consistency between different devices and sessions
 * Also handles automatic cleanup of expired breakup data
 */
export const usePartnerSync = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchPartner, fetchBreakupData, confirmRecovery } = useProfileStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Sync both partner and breakup data on authentication
      const syncData = async () => {
        await Promise.all([
          fetchPartner(),
          fetchBreakupData()
        ]);
      };

      syncData();
    }
  }, [isAuthenticated, fetchPartner, fetchBreakupData]);

  // Check for expired breakup data periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkExpiredBreakup = async () => {
      const { breakupData } = useProfileStore.getState();
      if (breakupData?.isActive) {
        const now = new Date().getTime();
        const autoDeleteTime = new Date(breakupData.autoDeleteDate).getTime();
        
        if (now >= autoDeleteTime) {
          console.log('Breakup data expired, auto-cleaning up');
          await confirmRecovery();
        }
      }
    };

    // Check every hour for expired breakup data
    const interval = setInterval(checkExpiredBreakup, 60 * 60 * 1000);
    
    // Also check once on mount
    checkExpiredBreakup();

    return () => clearInterval(interval);
  }, [isAuthenticated, confirmRecovery]);
};

export default usePartnerSync;
