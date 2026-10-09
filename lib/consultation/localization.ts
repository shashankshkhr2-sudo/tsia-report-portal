// lib/consultation/localization.ts
// Jeevan Sutra — Native Language Foundation
//
// Scope: Live Consultation only.
//
// LOCKED RULES:
// 1. Native-language content is retrieved directly.
// 2. No runtime translation between languages.
// 3. No silent fallback to another language.
// 4. Consultation and typing languages are independent.
// 5. Stable question IDs are shared across languages.
// 6. Client answers and practitioner observations
//    must be preserved exactly as entered.
// 7. Existing V2/V3 calculations remain unchanged.

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

export const DEFAULT_CONSULTATION_LANGUAGE:
  ConsultationLanguage = "en";

export const DEFAULT_TYPING_LANGUAGE:
  ConsultationTypingLanguage = "en";

// These IDs must remain stable even when
// the displayed language changes.

export const CONSULTATION_CONTENT_IDS = [
  "INTRO_WEEKDAYS",
  "INTRO_NAVAGRAHA",
  "INTRO_TIME",
  "CLARIFY_CONCERN",
] as const satisfies readonly ConsultationContentKey[];

// Each language has its own native-authored resource.
//
// These imports will be activated when the
// four language resource files are added.
// Until then, this foundation remains safe
// and independently deployable.

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

// An empty registry is intentional at this stage.
// It prevents accidental English fallback or
// pretending that translations are available.

export const consultationResourceRegistry:
  ConsultationResourceRegistry = {};

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

export function getConsultationLanguageInfo(
  language: ConsultationLanguage
): ConsultationLanguageInfo {
  return LANGUAGE_INFO[language];
}

export function getConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): ConsultationContent | null {
  const resource =
    consultationResourceRegistry[language];

  if (!resource) {
    return null;
  }

  return resource[contentId] ?? null;
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

// These values identify the requested language
// for a future speech-to-text provider.
//
// They do not themselves start recording or
// guarantee transcription availability.

export function getSpeechLocale(
  language: ConsultationLanguage
): string {
  return LANGUAGE_INFO[language].speechLocale;
}

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

// Do not translate, normalize or rewrite
// user-entered consultation text.

export function preserveConsultationText(
  text: string
): string {
  return text;
}