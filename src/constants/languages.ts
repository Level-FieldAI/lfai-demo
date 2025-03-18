export type SupportedLanguage = {
  value: string;
  label: string;
  flag?: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { value: "english", label: "English (USA)", flag: "🇺🇸" },
  { value: "english_uk", label: "English (UK)", flag: "🇬🇧" },
  { value: "english_au", label: "English (Australia)", flag: "🇦🇺" },
  { value: "english_ca", label: "English (Canada)", flag: "🇨🇦" },
  { value: "japanese", label: "Japanese", flag: "🇯🇵" },
  { value: "chinese", label: "Chinese", flag: "🇨🇳" },
  { value: "german", label: "German", flag: "🇩🇪" },
  { value: "hindi", label: "Hindi", flag: "🇮🇳" },
  { value: "french", label: "French (France)", flag: "🇫🇷" },
  { value: "french_ca", label: "French (Canada)", flag: "🇨🇦" },
  { value: "korean", label: "Korean", flag: "🇰🇷" },
  { value: "portuguese_br", label: "Portuguese (Brazil)", flag: "🇧🇷" },
  { value: "portuguese", label: "Portuguese (Portugal)", flag: "🇵🇹" },
  { value: "italian", label: "Italian", flag: "🇮🇹" },
  { value: "spanish", label: "Spanish (Spain)", flag: "🇪🇸" },
  { value: "spanish_mx", label: "Spanish (Mexico)", flag: "🇲🇽" },
  { value: "indonesian", label: "Indonesian", flag: "🇮🇩" },
  { value: "dutch", label: "Dutch", flag: "🇳🇱" },
  { value: "turkish", label: "Turkish", flag: "🇹🇷" },
  { value: "filipino", label: "Filipino", flag: "🇵🇭" },
  { value: "polish", label: "Polish", flag: "🇵🇱" },
  { value: "swedish", label: "Swedish", flag: "🇸🇪" },
  { value: "bulgarian", label: "Bulgarian", flag: "🇧🇬" },
  { value: "romanian", label: "Romanian", flag: "🇷🇴" },
  { value: "arabic_sa", label: "Arabic (Saudi Arabia)", flag: "🇸🇦" },
  { value: "arabic_ae", label: "Arabic (UAE)", flag: "🇦🇪" },
  { value: "czech", label: "Czech", flag: "🇨🇿" },
  { value: "greek", label: "Greek", flag: "🇬🇷" },
  { value: "finnish", label: "Finnish", flag: "🇫🇮" },
  { value: "croatian", label: "Croatian", flag: "🇭🇷" },
  { value: "malay", label: "Malay", flag: "🇲🇾" },
  { value: "russian", label: "Russian", flag: "🇷🇺" },
  { value: "slovak", label: "Slovak", flag: "🇸🇰" },
  { value: "danish", label: "Danish", flag: "🇩🇰" },
  { value: "tamil", label: "Tamil", flag: "🇮🇳" },
  { value: "ukrainian", label: "Ukrainian", flag: "🇺🇦" },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]; // English (USA)