export const StorageKey = {
  INTEL_EXPLORER_FILTERS_CONFIG: 'intel_explorer_filters_config',
} as const;
export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

// Campaign Status Constants
export const CampaignStatus = {
  DRAFTED: 'DRAFTED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;
export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];
