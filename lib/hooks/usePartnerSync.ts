'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { useProfileStore } from '../store';

/**
 * Hook to sync partner data from database when user is authenticated
 * This ensures data consistency between different devices and sessions
 */
export const usePartnerSync = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchPartner } = useProfileStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch partner data from database on authentication
      fetchPartner();
    }
  }, [isAuthenticated, fetchPartner]);
};

export default usePartnerSync;
