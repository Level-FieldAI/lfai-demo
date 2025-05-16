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
      name: 'Fred - Nebraska Basketball Avatar',
      description: 'Interactive avatar for University of Nebraska Basketball',
      persona_id: 'p0741545fff4',
      replica_id: 'r2c1d5839ac0',
      defaultLanguage: 'english',
      nameInGreeting: 'Fred',
      role: 'Your virtual Ambassador for University of Nebraska Mens Basketball Team, this chat is sponsored by Cerebro Sports, Basketballs Largest box Score Database',
      category: 'Sports'
    },
    {
      id: 'Dallas Mavericks',
      name: 'Dirk - Dallas Mavericks Fan Engagement Avatar',
      description: 'Interactive avatar for the Dallas Mavericks',
      persona_id: 'p69f3923f161',
      replica_id: 'r73fb0681a20',
      defaultLanguage: 'English',
      nameInGreeting: 'Dirk Nowitzki',
      role: 'Virtual Ambassador, and this chat is powered by WhitegloveAI—the best in AI adoption and managed services.',
      category: 'Sports'
    },
    {
      id: 'Byron Nelson',
      name: 'Byron Nelson - Golf Tournament Avatar',
      description: 'Interactive avatar for golf enthusiasts inspired by Byron Nelson Tournement',
      persona_id: 'p7da04b5343a',
      replica_id: 'r73fb0681a20',
      defaultLanguage: 'English',
      nameInGreeting: 'Byron',
      role: 'Here to bring the spirit of the Byron Nelson Tournament to life.',
      category: 'Sports'
    }
  ],
  'Real Estate': [
    {
      id: 'jason-fields-frisco',
      name: 'Jason - Fields Frisco Sales Consultant',
      description: 'Sales consultant for Fields Frisco luxury community',
      persona_id: 'p329111469cc',
      replica_id: 'r73fb0681a20',
      defaultLanguage: 'english',
      nameInGreeting: 'Jason',
      role: 'a sales consultant for Fields Frisco',
      category: 'Real Estate'
    },
    {
      id: 'title closing',
      name: 'Phillip - Virtual Closing Avatar',
      description: 'Interactive avatar for Community National Title',
      persona_id: 'p1389ed2744b',
      replica_id: 'r2c1d5839ac0',
      defaultLanguage: 'english',
      nameInGreeting: 'Phillip',
      role: 'a title specialist at Community National Title',
      category: 'Real Estate'
    }
  ],
  Concierge: [
    {
      id: 'gloria-consultant',
      name: 'Gloria - AI Consultant',
      description: 'Professional AI consultant for business inquiries',
      persona_id: 'pcabf8c842bb',
      replica_id: 'rbb0f535dd',
      defaultLanguage: 'english',
      nameInGreeting: 'Gloria',
      role: 'an AI consultant with WhitegloveAI',
      category: 'Concierge'
    },
    {
      id: 'diego-guide',
      name: 'Diego - Historical Site Guide',
      description: 'Historical Sites Guide for Goodwin Cabin',
      persona_id: 'p106de0182c2',
      replica_id: 'r73fb0681a20',
      defaultLanguage: 'english',
      nameInGreeting: 'Diego',
      role: 'a historical sites guide for Goodwin Cabin',
      category: 'Concierge'
    },
    {
      id: 'St. Kitts Tourguide',
      name: 'Mervyn - St. Kitts Tour Guide Avatar',
      description: 'Interactive avatar for St. Kitts',
      persona_id: 'p92c20ffb55d',
      replica_id: 'r9653b930d07',
      defaultLanguage: 'english',
      nameInGreeting: 'Mervyn',
      role: 'a tourism specialist at St. Kitts Tourism',
      category: 'Concierge'
    }, {
      id: 'Plug and Play',
      name: 'Saeed - Plug and Play Avatar',
      description: 'Interactive avatar for Plug and Play',
      persona_id: 'p4d13ae95122',
      replica_id: 'r2c1d5839ac0',
      defaultLanguage: 'english',
      nameInGreeting: 'Saeed',
      role: 'the CEO of Plug & Play, What inspired you to start your company, and what problem are you trying to solve?',
      category: 'Concierge'
    }
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];