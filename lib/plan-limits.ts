export const PLAN_LIMITS = {
  FREE: {
    postLimit: 15,       
    twitterAccounts: 1,
  },
  GROWTH: {
    postLimit: 300,    
    twitterAccounts: 3,
  },
  PREMIUM: {
    postLimit: 500,      
    twitterAccounts: 5,
  },
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;
