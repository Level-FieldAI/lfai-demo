import { SupportedLanguage } from './languages';

export type LanguageGreeting = {
  language: string;
  greeting: string;
};

export const LANGUAGE_GREETINGS: LanguageGreeting[] = [
  {
    language: 'english',
    greeting: 'Hello I am Gloria! I am an AI consultant with WhitegloveAI. How may I help you?'
  },
  {
    language: 'spanish',
    greeting: '¡Hola, soy Gloria! Soy una consultora de IA con WhitegloveAI. ¿Cómo puedo ayudarte?'
  },
  {
    language: 'french',
    greeting: 'Bonjour, je suis Gloria ! Je suis une consultante en IA chez WhitegloveAI. Comment puis-je vous aider ?'
  },
  {
    language: 'german',
    greeting: 'Hallo, ich bin Gloria! Ich bin eine KI-Beraterin bei WhitegloveAI. Wie kann ich Ihnen helfen?'
  },
  {
    language: 'italian',
    greeting: 'Ciao, sono Gloria! Sono una consulente di IA con WhitegloveAI. Come posso aiutarti?'
  },
  {
    language: 'portuguese',
    greeting: 'Olá, eu sou Gloria! Sou uma consultora de IA na WhitegloveAI. Como posso ajudá-lo?'
  },
  {
    language: 'japanese',
    greeting: 'こんにちは、グロリアです！WhitegloveAIのAIコンサルタントです。どのようにお手伝いできますか？'
  },
  {
    language: 'chinese',
    greeting: '你好，我是Gloria！我是WhitegloveAI的AI顾问。我能帮你什么忙？'
  },
  {
    language: 'korean',
    greeting: '안녕하세요, 저는 Gloria입니다! 저는 WhitegloveAI의 AI 컨설턴트입니다. 어떻게 도와드릴까요?'
  },
  {
    language: 'russian',
    greeting: 'Здравствуйте, я Глория! Я консультант по ИИ в WhitegloveAI. Чем я могу вам помочь?'
  },
  {
    language: 'arabic_sa',
    greeting: 'مرحبًا، أنا غلوريا! أنا مستشارة الذكاء الاصطناعي في WhitegloveAI. كيف يمكنني مساعدتك؟'
  },
  {
    language: 'hindi',
    greeting: 'नमस्ते, मैं ग्लोरिया हूँ! मैं WhitegloveAI के साथ एक AI सलाहकार हूँ। मैं आपकी कैसे मदद कर सकती हूँ?'
  },
  {
    language: 'dutch',
    greeting: 'Hallo, ik ben Gloria! Ik ben een AI-consultant bij WhitegloveAI. Hoe kan ik u helpen?'
  },
  {
    language: 'turkish',
    greeting: 'Merhaba, ben Gloria! WhitegloveAI\'da bir yapay zeka danışmanıyım. Size nasıl yardımcı olabilirim?'
  },
  {
    language: 'polish',
    greeting: 'Cześć, jestem Gloria! Jestem konsultantką AI w WhitegloveAI. Jak mogę ci pomóc?'
  },
  {
    language: 'swedish',
    greeting: 'Hej, jag är Gloria! Jag är en AI-konsult hos WhitegloveAI. Hur kan jag hjälpa dig?'
  },
  {
    language: 'greek',
    greeting: 'Γεια σας, είμαι η Gloria! Είμαι σύμβουλος τεχνητής νοημοσύνης στην WhitegloveAI. Πώς μπορώ να σας βοηθήσω;'
  },
  {
    language: 'finnish',
    greeting: 'Hei, olen Gloria! Olen tekoälykonsultti WhitegloveAI:ssa. Kuinka voin auttaa sinua?'
  },
  {
    language: 'danish',
    greeting: 'Hej, jeg er Gloria! Jeg er AI-konsulent hos WhitegloveAI. Hvordan kan jeg hjælpe dig?'
  },
  {
    language: 'ukrainian',
    greeting: 'Привіт, я Глорія! Я консультант з ШІ в WhitegloveAI. Чим я можу вам допомогти?'
  }
];

export const getGreetingForLanguage = (language: string): string => {
  const greeting = LANGUAGE_GREETINGS.find(g => g.language === language);
  return greeting?.greeting || LANGUAGE_GREETINGS[0].greeting; // Default to English if not found
};