type AvatarCategory = 'Sports' | 'Real Estate' | 'Concierge' | 'Radio' | 'Fan Engagement';

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
      name: 'LFU Basketball Coach',
      description: 'Interactive avatar for University of Nebraska Basketball',
      persona_id: 'pe62f4e977b1',
      replica_id: 'r187691d25a7',
      defaultLanguage: 'english',
      nameInGreeting: 'Coach Dawson',
      role: 'Head Coach here at Level Field University Mens Basketball. Im thrilled youre considering Level Field. Were building something special here in Frisco, Texas, and Im ready to tell you all about it. Whats on your mind today?',
      category: 'Sports'
    }
  ],
  'Real Estate': [
    // New CVI entry
    {
      id: 'fields-frisco-conversational',
      name: 'Community Devoplement Agent',
      description: 'Conversational avatar for Fields Frisco community',
      persona_id: 'p19f29670176',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Will',
      role: 'Virtual guide for Fields Frisco real estate.',
      category: 'Real Estate'
    }
  ],
  Concierge: [
    {
      id: 'ip-advisor',
      name: 'Senior Patent IP Advisor',
      description: 'Your virtual AI advisor for intellectual property matters.',
      persona_id: 'p55b8ca768bc',
      replica_id: 'rc71d224d554',
      defaultLanguage: 'english',
      nameInGreeting: 'James',
      role: 'Your virtual AI senior partner at a top-tier intellectual property law firm.',
      category: 'Concierge'
    },
    {
      id: 'St. Kitts Tourguide',
      name: 'Island Tour Guide',
      description: 'Interactive avatar for St. Kitts',
      persona_id: 'pca68e2ee647',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Alexander',
      role: 'Your virtual AI tourism specialist at St. Kitts Tourism',
      category: 'Concierge'
    }
  ],
  'Radio': [
    {
      id: 'Erick-radio',
      name: 'On the Block',
      description: 'Interactive avatar of Erick Strickland – Former NBA Player',
      persona_id: 'p631ab01abd1',
      replica_id: 'r187691d25a7',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'ready to bring the heat straight from On The Block. Whether its Husker Nation, the pros, or the octagon, lets get into it!',
      category: 'Radio'
    }
  ],
  'Fan Engagement': [
    {
      id: 'Erick-fan',
      name: 'Fan Engagement',
      description: 'Interactive avatar of Erick Strickland – Former NBA Player',
      persona_id: 'p887f472f253',
      replica_id: 'r187691d25a7',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'I played 9 years in the NBA, this chat is sponsored by Cerebro Sports, Basketballs Largest box Score Database, what would you like to talk about?',
      category: 'Fan Engagement'
    }
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];