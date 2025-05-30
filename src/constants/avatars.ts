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
      name: 'Erick - Nebraska Basketball Avatar',
      description: 'Interactive avatar for University of Nebraska Basketball',
      persona_id: 'p457dff3ae3c',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'Your virtual Ambassador for University of Nebraska Mens Basketball Team, this chat is sponsored by Cerebro Sports, Basketballs Largest box Score Database',
      category: 'Sports'
    },
    // New CVI entries
    {
      id: 'jalen-brunson-knicks',
      name: 'Jalen Brunson – New York Knicks',
      description: 'Interactive avatar for New York Knicks fans',
      persona_id: 'p22728e31d38',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Jalen Brunson',
      role: 'Your virtual ambassador for the New York Knicks.',
      category: 'Sports'
    },
        {
      id: 'uncle-drew-mavs-super-fan',
      name: 'Uncle Drew Mavs Super Fan',
      description: 'Uncle Drew persona for Mavericks fans',
      persona_id: 'p5685c9791a9',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Uncle Drew',
      role: 'Channeling the spirit of Uncle Drew for Mavericks fans.',
      category: 'Sports'
    },
  ],
  'Real Estate': [
    
    // New CVI entry
    {
      id: 'fields-frisco-conversational',
      name: 'Fields Frisco Conversational',
      description: 'Conversational avatar for Fields Frisco community',
      persona_id: 'REPLACE_WITH_ID',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Fields Frisco',
      role: 'Virtual guide for Fields Frisco real estate.',
      category: 'Real Estate'
    },
  ],
  Concierge: [
    {
      id: 'gloria-consultant',
      name: 'Gloria - AI Consultant',
      description: 'Professional AI consultant for business inquiries',
      persona_id: 'pcabf8c842bb',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Gloria',
      role: 'an AI consultant with Level-FieldAI',
      category: 'Concierge'
    },
    {
      id: 'St. Kitts Tourguide',
      name: 'Alexander - St. Kitts and Nevis Tour Guide Avatar',
      description: 'Interactive avatar for St. Kitts',
      persona_id: 'p92c20ffb55d',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Alexander',
      role: 'a tourism specialist at St. Kitts Tourism',
      category: 'Concierge'
    },
    // New CVI entries
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
    {
      id: 'finely-ai-financial-foundation',
      name: 'Finely AI Financial Foundation',
      description: 'AI-powered financial foundation assistant',
      persona_id: 'pcae273144bc',
      replica_id: 'r0e739516da9',
      defaultLanguage: 'english',
      nameInGreeting: 'Finely AI',
      role: 'Your AI assistant for financial foundation guidance.',
      category: 'Concierge'
    }
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];