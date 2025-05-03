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
    replica_id: 'r73fb0681a20', 
    defaultLanguage: 'english',
    nameInGreeting: 'Diego',
    role: 'a historical sites guide for Goodwin Cabin'
  },
  /*
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
  */
  {
    id: 'jason-fields-frisco',
    name: 'Jason - Fields Frisco Sales Consultant',
    description: 'Sales consultant for Fields Frisco luxury community',
    persona_id: 'p329111469cc',
    replica_id: 'r73fb0681a20',
    defaultLanguage: 'english',
    nameInGreeting: 'Jason',
    role: 'a sales consultant for Fields Frisco'
  },
  {
    id: 'nebraska-basketball',
    name: 'Jarod - Nebraska Basketball Avatar',
    description: 'Interactive avatar for University of Nebraska Basketball',
    persona_id: 'p0741545fff4',
    replica_id: 'r2c1d5839ac0',
    defaultLanguage: 'english',
    nameInGreeting: 'Coach Hoiberg',
    role: 'Head Coach of the University of Nebraska Mens Basketball Team'
  },
  /*
  {
    id: 'Colorado Football',
    name: 'Prime - Colorado Football Avatar',
    description: 'Interactive avatar for University of Colorado Football',
    persona_id: 'p1be37e29879',
    replica_id: 'r2c1d5839ac0',
    defaultLanguage: 'english',
    nameInGreeting: 'Colorado Football Guide the Prime Era',
    role: 'a specialist in University of Colorado Football'
  }
    */
  {
    id: 'title closing',
    name: 'Phillip - Virtual Closing Avatar',
    description: 'Interactive avatar for Community National Title',
    persona_id: 'p1389ed2744b',
    replica_id: 'r2c1d5839ac0',
    defaultLanguage: 'english',
    nameInGreeting: 'Phillip',
    role: 'a title specialist at Community National Title'
  },
  {
    id: 'St. Kitts Tourguide',
    name: 'Mervyn - St. Kitts Tour Guide Avatar',
    description: 'Interactive avatar for St. Kitts',
    persona_id: 'p92c20ffb55d',
    replica_id: 'r9653b930d07',
    defaultLanguage: 'kittitian_creole',
    nameInGreeting: 'Mervyn',
    role: 'a tourism specialist at St. Kitts Tourism'
  },
  {
    id: 'Dallas Mavericks',
    name: 'Dirk - Dallas Mavericks Fan Engagement Avatar',
    description: 'Interactive avatar for the Dallas Mavericks',
    persona_id: 'p69f3923f161',
    replica_id: 'r73fb0681a20',
    defaultLanguage: 'English',
    nameInGreeting: 'Dirk Nowitzki',
    role: 'proud to have spent my entire NBA career in Dallas. From my first game in 1998 to raising the championship trophy in 2011, every moment with the Mavs has been unforgettable. I’m excited to share stories from my journey and celebrate what makes this organization and our fans so special. What would you like to know about my career or the Mavericks family?'
  },
  {
    id: 'Byron Nelson',
    name: 'Byron Nelson - Golf Tournament Avatar',
    description: 'Interactive avatar for golf enthusiasts inspired by Byron Nelson Tournement',
    persona_id: 'p47f3923f162',
    replica_id: 'r83fb0681a21',
    defaultLanguage: 'English',
    nameInGreeting: 'Byron',
    role: 'Here to bring the spirit of the Byron Nelson Tournament to life. Whether you want to discuss golf history, get tips to improve your game, or hear stories from the world of golf, I’m here to help!'
     },
];

export const DEFAULT_AVATAR = AVATAR_USE_CASES[0]; // Gloria as default