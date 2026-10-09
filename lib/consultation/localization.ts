
// lib/consultation/localization.ts
// Jeevan Sutra — Native Language Foundation
//
// Scope: Live Consultation only.
//
// LOCKED RULES:
// 1. Retrieve native-authored content directly.
// 2. Never translate between languages at runtime.
// 3. Never silently fall back to another language.
// 4. Consultation, typing and voice languages are independent.
// 5. Question IDs remain stable across languages.
// 6. Preserve client and practitioner text exactly.
// 7. Do not change V2/V3 numerology calculations.

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
// 2. Stable content identifiers
// --------------------------------------------------

export type ConsultationContentKey =
  | "INTRO_WEEKDAYS"
  | "INTRO_NAVAGRAHA"
  | "INTRO_TIME"
  | "CLARIFY_CONCERN";

export interface ConsultationContent {
  id: ConsultationContentKey;
  title: string;
  question: string;
  explanation: string;
}

export const CONSULTATION_CONTENT_IDS = [
  "INTRO_WEEKDAYS",
  "INTRO_NAVAGRAHA",
  "INTRO_TIME",
  "CLARIFY_CONCERN",
] as const satisfies readonly ConsultationContentKey[];

// --------------------------------------------------
// 3. Language metadata
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
// 4. Default preferences
// --------------------------------------------------

export const DEFAULT_CONSULTATION_LANGUAGE:
  ConsultationLanguage = "en";

export const DEFAULT_TYPING_LANGUAGE:
  ConsultationTypingLanguage = "en";

// --------------------------------------------------
// 5. Native-language resource registry
// --------------------------------------------------

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

// Each language uses its own native-authored file.
// No runtime translation is performed.
// No cross-language fallback is permitted.

export const consultationResourceRegistry:
  ConsultationResourceRegistry = {
    hi: hindiConsultationContent,
    en: englishConsultationContent,
    mr: marathiConsultationContent,
    gu: gujaratiConsultationContent,
  };

// --------------------------------------------------
// 6. Language validation
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
// 7. Language information
// --------------------------------------------------

export function getConsultationLanguageInfo(
  language: ConsultationLanguage
): ConsultationLanguageInfo {
  return LANGUAGE_INFO[language];
}

// --------------------------------------------------
// 8. Direct native-content retrieval
// --------------------------------------------------

export function getConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): ConsultationContent | null {
  const resource =
    consultationResourceRegistry[language];

  if (!resource) {
    return null;
  }

  const content = resource[contentId];

  // Reject missing, mismatched or incomplete content.
  // Never substitute content from another language.

  if (
    !content ||
    content.id !== contentId ||
    typeof content.title !== "string" ||
    typeof content.question !== "string" ||
    typeof content.explanation !== "string" ||
    !content.title.trim() ||
    !content.question.trim() ||
    !content.explanation.trim()
  ) {
    return null;
  }

  return content;
}

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
// 9. Independent typing-language configuration
// --------------------------------------------------

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

// These settings provide language metadata for
// text inputs and textareas.
//
// The user's device controls the actual keyboard.
// Changing this setting does not automatically
// install or switch a keyboard layout.

// --------------------------------------------------
// 10. Voice-language preparation
// --------------------------------------------------

export function getSpeechLocale(
  language: ConsultationLanguage
): string {
  return LANGUAGE_INFO[language].speechLocale;
}

// This function only returns a speech locale.
// It does not start recording, request microphone
// permission or provide transcription.

// --------------------------------------------------
// 11. Independent language preferences
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

export function updateConsultationLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    consultationLanguage: language,
  };
}

export function updateTypingLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationTypingLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    typingLanguage: language,
  };
}

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
// 12. Preserve original consultation responses
// --------------------------------------------------

export function preserveConsultationText(
  text: string
): string {
  return text;
}
