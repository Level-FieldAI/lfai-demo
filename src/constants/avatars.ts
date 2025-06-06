export type AvatarCategory = 'Resort Services' | 'Dining & Experiences' | 'Concierge';

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
  'Resort Services': [
    {
      id: 'tourism',
      name: 'Resort Activities Coordinator',
      description: 'Your personal guide to Four Seasons Anguilla activities and amenities',
      persona_id: 'pcb0a3d75781',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'Your Four Seasons Resort Activities Coordinator',
      category: 'Resort Services'
    },
  ],
  'Dining & Experiences': [
    {
      id: 'Erick',
      name: 'Culinary Experience Guide',
      description: 'Expert guide for Four Seasons dining and culinary experiences',
      persona_id: 'p9ac6ee1e114',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Kenroy',
      role: 'Your Four Seasons Culinary Experience Guide',
      category: 'Dining & Experiences'
    },
  ],
  Concierge: [
    {
      id: 'ghanacation-virtual-tour',
      name: 'Luxury Concierge Assistant',
      description: 'Your personal Four Seasons concierge for exclusive experiences',
      persona_id: 'p5c14969b420',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Enoch',
      role: 'Your Four Seasons Luxury Concierge Assistant',
      category: 'Concierge'
    },
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];