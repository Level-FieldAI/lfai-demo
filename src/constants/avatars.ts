export type AvatarUseCase = {
  id: string;
  name: string;
  description: string;
  persona_id: string;
  replica_id: string; 
  defaultLanguage: string;
  nameInGreeting: string;
  role: string;
};

export const AVATAR_USE_CASES: AvatarUseCase[] = [
  {
    id: 'gloria-consultant',
    name: 'Gloria - AI Consultant',
    description: 'Professional AI consultant for business inquiries',
    persona_id: 'pcabf8c842bb', // Original ID from working implementation
    replica_id: 'rbb0f535dd', // Original ID from working implementation
    defaultLanguage: 'english',
    nameInGreeting: 'Gloria',
    role: 'an AI consultant with WhitegloveAI'
  },
  {
    id: 'diego-guide',
    name: 'Diego - Historical Site Guide',
    description: 'Historical Sites Guide for Goodwin Cabin',
    persona_id: 'p106de0182c2', 
    replica_id: 'r5c5d0370b', 
    defaultLanguage: 'english',
    nameInGreeting: 'Diego',
    role: 'a historical sites guide for Goodwin Cabin'
  },
  {
    id: 'raj-safety',
    name: 'Raj - RigSafe Safety Officer',
    description: 'Safety officer for oil rig operations',
    persona_id: 'pc305106166e', // Verify this ID exists in your Tavus account
    replica_id: 'raff7843cc3d', // Using Gloria's replica ID for testing - replace with correct ID
    defaultLanguage: 'english',
    nameInGreeting: 'Raj',
    role: 'a safety manager for oil rig operations with RigSafe'
  },
  {
    id: 'luna-benefits',
    name: 'Luna - Benefits Navigator',
    description: 'Company benefits navigator for TotalCare Solutions',
    persona_id: 'p6a7e5a0be44', // Verify this ID exists in your Tavus account
    replica_id: 'r14ea4b254d5', // Using Gloria's replica ID for testing - replace with correct ID
    defaultLanguage: 'english',
    nameInGreeting: 'Luna',
    role: 'a benefits advisor with TotalCare Solutions'
  },
  {
    id: 'jason-fields-frisco',
    name: 'Jason - Fields Frisco Sales Consultant',
    description: 'Sales consultant for Fields Frisco luxury community',
    persona_id: 'p329111469cc',
    replica_id: 'r9653b930d07',
    defaultLanguage: 'english',
    nameInGreeting: 'Jason',
    role: 'a sales consultant for Fields Frisco'
  },
  {
    id: 'nebraska-basketball',
    name: 'Nebraska Basketball Avatar',
    description: 'Interactive avatar for University of Nebraska Basketball',
    persona_id: 'p0741545fff4',
    replica_id: 'r9653b930d07',
    defaultLanguage: 'english',
    nameInGreeting: 'Nebraska Basketball Guide',
    role: 'a specialist in University of Nebraska Basketball'
  }
];

export const DEFAULT_AVATAR = AVATAR_USE_CASES[0]; // Gloria as default