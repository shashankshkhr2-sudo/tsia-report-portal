// lib/consultation/localization.ts
// Jeevan Sutra — Four-Language Localization Foundation
//
// Scope: Live Consultation only.
//
// LOCKED RULES:
// 1. Each language has independently maintained content.
// 2. No runtime translation between languages.
// 3. No automatic fallback to another language.
// 4. Consultation, typing and voice languages are independent.
// 5. Stable question IDs are shared across languages.
// 6. Client answers and practitioner observations are
//    preserved exactly as entered.
// 7. Existing consultation records remain unchanged.
// 8. V2/V3 numerology engines remain unchanged.

import { hindiConsultationContent } from "./locales/hi";
import { englishConsultationContent } from "./locales/en";
import { marathiConsultationContent } from "./locales/mr";
import { gujaratiConsultationContent } from "./locales/gu";

// --------------------------------------------------
// 1. Supported languages
// --------------------------------------------------

export const CONSULTATION_LANGUAGES = [
  "hi",
  "en",
  "mr",
  "gu",
] as const;

export type ConsultationLanguage =
  (typeof CONSULTATION_LANGUAGES)[number];

export type ConsultationTypingLanguage =
  ConsultationLanguage;

// --------------------------------------------------
// 2. Stable consultation content IDs
// --------------------------------------------------

export type ConsultationContentKey =
  | "INTRO_WEEKDAYS"
  | "INTRO_NAVAGRAHA"
  | "INTRO_TIME"
  | "CLARIFY_CONCERN";

export const CONSULTATION_CONTENT_IDS = [
  "INTRO_WEEKDAYS",
  "INTRO_NAVAGRAHA",
  "INTRO_TIME",
  "CLARIFY_CONCERN",
] as const satisfies readonly ConsultationContentKey[];

// --------------------------------------------------
// 3. Content structure
// --------------------------------------------------

export interface ConsultationContent {
  id: ConsultationContentKey;
  title: string;
  question: string;
  explanation: string;
}

export type ConsultationLanguageResources =
  Partial<
    Record<
      ConsultationContentKey,
      ConsultationContent
    >
  >;

export type ConsultationResourceRegistry =
  Partial<
    Record<
      ConsultationLanguage,
      ConsultationLanguageResources
    >
  >;

// --------------------------------------------------
// 4. Language metadata
// --------------------------------------------------

export interface ConsultationLanguageInfo {
  code: ConsultationLanguage;
  nativeName: string;
  englishName: string;
  locale: string;
  script: "Devanagari" | "Latin" | "Gujarati";
  direction: "ltr";
  speechLocale: string;
}

export const LANGUAGE_INFO: Record<
  ConsultationLanguage,
  ConsultationLanguageInfo
> = {
  hi: {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    locale: "hi-IN",
    script: "Devanagari",
    direction: "ltr",
    speechLocale: "hi-IN",
  },

  en: {
    code: "en",
    nativeName: "English",
    englishName: "English",
    locale: "en-IN",
    script: "Latin",
    direction: "ltr",
    speechLocale: "en-IN",
  },

  mr: {
    code: "mr",
    nativeName: "मराठी",
    englishName: "Marathi",
    locale: "mr-IN",
    script: "Devanagari",
    direction: "ltr",
    speechLocale: "mr-IN",
  },

  gu: {
    code: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
    locale: "gu-IN",
    script: "Gujarati",
    direction: "ltr",
    speechLocale: "gu-IN",
  },
};

// --------------------------------------------------
// 5. Default language preferences
// --------------------------------------------------

export const DEFAULT_CONSULTATION_LANGUAGE:
  ConsultationLanguage = "en";

export const DEFAULT_TYPING_LANGUAGE:
  ConsultationTypingLanguage = "en";

// --------------------------------------------------
// 6. Native-language resource registry
// --------------------------------------------------
//
// Each language is imported directly from its
// independent resource file.
//
// No runtime translation is performed.

export const consultationResourceRegistry = {
  hi: hindiConsultationContent,
  en: englishConsultationContent,
  mr: marathiConsultationContent,
  gu: gujaratiConsultationContent,
} satisfies ConsultationResourceRegistry;

// --------------------------------------------------
// 7. Language validation
// --------------------------------------------------

export function isConsultationLanguage(
  value: unknown
): value is ConsultationLanguage {
  return (
    typeof value === "string" &&
    CONSULTATION_LANGUAGES.some(
      (language) => language === value
    )
  );
}

// --------------------------------------------------
// 8. Language information
// --------------------------------------------------

export function getConsultationLanguageInfo(
  language: ConsultationLanguage
): ConsultationLanguageInfo {
  return LANGUAGE_INFO[language];
}

// --------------------------------------------------
// 9. Direct native-language content retrieval
// --------------------------------------------------

export function getConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): ConsultationContent | null {
  const resources:
    ConsultationLanguageResources =
      consultationResourceRegistry[language];

  return resources[contentId] ?? null;
}

// --------------------------------------------------
// 10. Check native-language content availability
// --------------------------------------------------

export function hasConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): boolean {
  return (
    getConsultationContent(
      language,
      contentId
    ) !== null
  );
}

// --------------------------------------------------
// 11. Native typing preferences
// --------------------------------------------------
//
// HTML language hints help browsers and keyboards,
// but cannot force Android to change its keyboard.

export function getTypingInputProps(
  language: ConsultationTypingLanguage
): {
  lang: string;
  dir: "ltr";
  autoCapitalize: "sentences";
  spellCheck: boolean;
} {
  const info = LANGUAGE_INFO[language];

  return {
    lang: info.locale,
    dir: info.direction,
    autoCapitalize: "sentences",
    spellCheck: true,
  };
}

// --------------------------------------------------
// 12. Voice transcription locale
// --------------------------------------------------
//
// This prepares language selection for a future
// speech-to-text integration.
//
// It does not start recording or guarantee that
// a transcription provider supports the locale.

export function getSpeechLocale(
  language: ConsultationLanguage
): string {
  return LANGUAGE_INFO[language].speechLocale;
}

// --------------------------------------------------
// 13. Independent language preferences
// --------------------------------------------------

export interface ConsultationLanguagePreferences {
  consultationLanguage: ConsultationLanguage;
  typingLanguage: ConsultationTypingLanguage;
  voiceLanguage: ConsultationLanguage;
}

export function createConsultationLanguagePreferences(
  preferredLanguage: ConsultationLanguage =
    DEFAULT_CONSULTATION_LANGUAGE
): ConsultationLanguagePreferences {
  return {
    consultationLanguage: preferredLanguage,
    typingLanguage: preferredLanguage,
    voiceLanguage: preferredLanguage,
  };
}

// --------------------------------------------------
// 14. Change consultation language
// --------------------------------------------------

export function updateConsultationLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    consultationLanguage: language,
  };
}

// --------------------------------------------------
// 15. Change typing language
// --------------------------------------------------

export function updateTypingLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationTypingLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    typingLanguage: language,
  };
}

// --------------------------------------------------
// 16. Change voice transcription language
// --------------------------------------------------

export function updateVoiceLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    voiceLanguage: language,
  };
}

// --------------------------------------------------
// 17. Preserve original consultation text
// --------------------------------------------------
//
// Never automatically translate, trim, normalize
// or rewrite client/practitioner responses.

export function preserveConsultationText(
  text: string
): string {
  return text;
}