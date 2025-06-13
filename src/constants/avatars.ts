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
      replica_id: 'r957ffc19f1d',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'Your virtual AI agent for University of Nebraska Mens Basketball Team',
      category: 'Sports'
    },
    // New CVI entries
    
    {
      id: 'Euless-virtual-tour-guide',
      name: 'Euless Library Agent',
      description: 'Virtual tour guide for Euless Public Library tours',
      persona_id: 'p7f770c70c12',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Scott',
      role: 'Your virtual AI agent for the Euless Public Library.',
      category: 'Concierge'
    },
    {
      id: 'Erick',
      name: 'AI Erick Strickland',
      description: 'Interactive avatar of Erick Strickland – Former NBA Player',
      persona_id: 'p887f472f253',
      replica_id: 'r957ffc19f1d',
      defaultLanguage: 'english',
      nameInGreeting: 'Virtaul Erick Strickland',
      role: 'I played 9 years in the NBA, this chat is sponsored by Cerebro Sports, Basketballs Largest box Score Database, what would you like to talk about?',
      category: 'Sports'
    },     
  ],
  'Real Estate': [
    
    // New CVI entry
    {
      id: 'fields-frisco-conversational',
      name: 'Frisco Fields Community Agent',
      description: 'Conversational avatar for Fields Frisco community',
      persona_id: 'p19f29670176',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Will',
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