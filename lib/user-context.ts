import { useAuthStore, useProfileStore } from './store';

/**
 * Helper function to create consistent user context for AI API calls
 */
export function createUserContext() {
  const { user } = useAuthStore.getState();
  const { partner, breakupData } = useProfileStore.getState();

  return {
    name: user?.name,
    birthDate: user?.birthDate,
    birthTime: user?.birthTime,
    hasPartner: !!partner,
    isInBreakup: !!breakupData?.isActive,
    partnerName: partner?.name || breakupData?.partnerName,
    partnerData: partner ? {
      name: partner.name,
      birthDate: partner.birthDate,
      birthTime: partner.birthTime,
      birthPlace: partner.birthPlace,
      relationship: partner.relationship,
      startDate: partner.startDate
    } : undefined,
    breakupData: breakupData?.isActive ? {
      partnerName: breakupData.partnerName,
      breakupDate: breakupData.breakupDate,
      autoDeleteDate: breakupData.autoDeleteDate,
      weeklyCheckDone: breakupData.weeklyCheckDone || []
    } : undefined
  };
}

/**
 * React hook to get user context
 */
export function useUserContext() {
  const { user } = useAuthStore();
  const { partner, breakupData } = useProfileStore();

  return {
    name: user?.name,
    birthDate: user?.birthDate,
    birthTime: user?.birthTime,
    hasPartner: !!partner,
    isInBreakup: !!breakupData?.isActive,
    partnerName: partner?.name || breakupData?.partnerName,
    partnerData: partner ? {
      name: partner.name,
      birthDate: partner.birthDate,
      birthTime: partner.birthTime,
      birthPlace: partner.birthPlace,
      relationship: partner.relationship,
      startDate: partner.startDate
    } : undefined,
    breakupData: breakupData?.isActive ? {
      partnerName: breakupData.partnerName,
      breakupDate: breakupData.breakupDate,
      autoDeleteDate: breakupData.autoDeleteDate,
      weeklyCheckDone: breakupData.weeklyCheckDone || []
    } : undefined
  };
}