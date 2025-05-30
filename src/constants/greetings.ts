export type LanguageGreeting = {
  language: string;
  template: string;
};

export const LANGUAGE_GREETING_TEMPLATES: LanguageGreeting[] = [
  {
    language: 'english',
    template: 'Hello I am {name}! I am {role}. How may I help you?'
  },
  {
    language: 'spanish',
    template: '¡Hola, soy {name}! Soy {role}. ¿Cómo puedo ayudarte?'
  },
  {
    language: 'french',
    template: 'Bonjour, je suis {name} ! Je suis {role}. Comment puis-je vous aider ?'
  },
  {
    language: 'german',
    template: 'Hallo, ich bin {name}! Ich bin {role}. Wie kann ich Ihnen helfen?'
  },
  {
    language: 'italian',
    template: 'Ciao, sono {name}! Sono {role}. Come posso aiutarti?'
  },
  {
    language: 'portuguese',
    template: 'Olá, eu sou {name}! Sou {role}. Como posso ajudá-lo?'
  },
  {
    language: 'japanese',
    template: 'こんにちは、{name}です！{role}です。どのようにお手伝いできますか？'
  },
  {
    language: 'chinese',
    template: '你好，我是{name}！我是{role}。我能帮你什么忙？'
  },
  {
    language: 'korean',
    template: '안녕하세요, 저는 {name}입니다! 저는 {role}입니다. 어떻게 도와드릴까요?'
  },
  {
    language: 'russian',
    template: 'Здравствуйте, я {name}! Я {role}. Чем я могу вам помочь?'
  },
  {
    language: 'arabic_sa',
    template: 'مرحبًا، أنا {name}! أنا {role}. كيف يمكنني مساعدتك؟'
  },
  {
    language: 'hindi',
    template: 'नमस्ते, मैं {name} हूँ! मैं {role} हूँ। मैं आपकी कैसे मदद कर सकती हूँ?'
  },
  {
    language: 'dutch',
    template: 'Hallo, ik ben {name}! Ik ben {role}. Hoe kan ik u helpen?'
  },
  {
    language: 'turkish',
    template: 'Merhaba, ben {name}! {role}. Size nasıl yardımcı olabilirim?'
  },
  {
    language: 'polish',
    template: 'Cześć, jestem {name}! Jestem {role}. Jak mogę ci pomóc?'
  },
  {
    language: 'swedish',
    template: 'Hej, jag är {name}! Jag är {role}. Hur kan jag hjälpa dig?'
  },
  {
    language: 'greek',
    template: 'Γεια σας, είμαι η {name}! Είμαι {role}. Πώς μπορώ να σας βοηθήσω;'
  },
  {
    language: 'finnish',
    template: 'Hei, olen {name}! Olen {role}. Kuinka voin auttaa sinua?'
  },
  {
    language: 'danish',
    template: 'Hej, jeg er {name}! Jeg er {role}. Hvordan kan jeg hjælpe dig?'
  },
  {
    language: 'ukrainian',
    template: 'Привіт, я {name}! Я {role}. Чим я можу вам допомогти?'
  }
];

export const getGreetingForLanguage = (
  language: string, 
  name: string = 'Gloria', 
  role: string = 'an AI consultant with Level-FieldAI'
): string => {
  const template = LANGUAGE_GREETING_TEMPLATES.find(g => g.language === language);
  const defaultTemplate = LANGUAGE_GREETING_TEMPLATES[0].template;
  
  const greetingTemplate = template?.template || defaultTemplate;
  return greetingTemplate.replace('{name}', name).replace('{role}', role);
};