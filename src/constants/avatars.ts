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
      id: 'tourism',
      name: 'Anguilla Virtual Tourism Concierge',
      description: 'Interactive avatar for University of Nebraska Basketball',
      persona_id: 'pcb0a3d75781',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Erick',
      role: 'Your virtual AI anguilla Virtual tourism Concierge',
      category: 'Concierge'
    },
    // New CVI entries
    {
      id: 'Erick',
      name: 'Anguilla Business and Experience Connector',
      description: 'Anguilla Business and Experience Connector',
      persona_id: 'p9ac6ee1e114',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Kenroy',
      role: 'I am your virutal AI Anguilla Business and Experience Connector',
      category: 'Concierge'
    },
    
    {
      id: 'ghanacation-virtual-tour',
      name: 'Anguilla Events Alerts and Cultural Guide',
      description: 'Anguilla Events Alerts and Cultural Guide',
      persona_id: 'p5c14969b420',
      replica_id: 'r63bd2510c34',
      defaultLanguage: 'english',
      nameInGreeting: 'Enoch',
      role: 'Your virtual AI ambassader for Anguilla Events Alerts and Cultural Guide.',
      category: 'Concierge'
    },
        
  ],
  'Real Estate': [
    
    
  ],
  Concierge: [
    
    
  ]
};

export const AVATAR_USE_CASES = Object.values(AVATAR_CATEGORIES).flat();
export const DEFAULT_AVATAR = AVATAR_USE_CASES[0];