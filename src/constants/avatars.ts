export type AvatarCategory = 'Sports' | 'Real Estate' | 'Concierge';

export type AvatarUseCase = {
  id: string;
  name: string;
  description: string;
  persona_id: string;
  replica_id: string; 
  defaultLanguage: string;
  nameInGreeting: string;
  role: string;
  category: AvatarCategory;
};

// Group avatars by category
export const AVATAR_CATEGORIES: Record<AvatarCategory, AvatarUseCase[]> = {
  Sports: [
    {
      id: 'nebraska-basketball',
      name: 'Nebraska Basketball Avatar',
      description: 'Interactive avatar for University of Nebraska Basketball',
      persona_id: 'p457dff3ae3c',
      replica_id: 'ra8460d6f9f2',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'Your virtual AI Ambassador for University of Nebraska Mens Basketball Team',
      category: 'Sports'
    },
    // New CVI entries
    {
      id: 'Erick',
      name: 'Erick Strickland – Former NBA Player',
      description: 'Interactive avatar of Erick Strickland – Former NBA Player',
      persona_id: 'p887f472f253',
      replica_id: 'ra8460d6f9f2',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick Strickland',
      role: 'Your virtual AI ambassador, this chat is sponsored by Cerebro Sports, Basketballs Largest box Score Database',
      category: 'Sports'
    },
    
    {
      id: 'ghanacation-virtual-tour',
      name: 'Ghanacation com Virtual Tour',
      description: 'Virtual tour guide for Ghanacation.com',
      persona_id: 'p1ca48c757b5',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Ghanacation Guide',
      role: 'Your virtual tour guide for Ghanacation.com.',
      category: 'Concierge'
    },
        
  ],
  'Real Estate': [
    
    // New CVI entry
    {
      id: 'fields-frisco-conversational',
      name: 'Fields Frisco Community',
      description: 'Conversational avatar for Fields Frisco community',
      persona_id: 'p19f29670176',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Fields Frisco',
      role: 'Virtual guide for Fields Frisco real estate.',
      category: 'Real Estate'
    },
  ],
  Concierge: [
    
    {
      id: 'St. Kitts Tourguide',
      name: 'St. Kitts and Nevis Tour Guide',
      description: 'Interactive avatar for St. Kitts',
      persona_id: 'pca68e2ee647',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Alexander',
      role: 'Your virtual AI tourism specialist at St. Kitts Tourism',
      category: 'Concierge'
    },
    
    
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];