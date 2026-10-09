
// lib/consultation/localization.ts
// Jeevan Sutra — Native Language Foundation
//
// SIMPLE • FAST • SAFE • RELIABLE
//
// LOCKED RULES:
// 1. Retrieve native-authored content directly.
// 2. Never translate between languages at runtime.
// 3. Never silently fall back to another language.
// 4. Consultation, typing and voice are independent.
// 5. Question IDs remain stable across languages.
// 6. Preserve client and practitioner text.
// 7. Do not change V2/V3 numerology calculations.

import {
  hindiConsultationContent,
  hindiConsultationTopicQuestions,
  hindiFamiliarityOptions,
} from './locales/hi'

import {
  englishConsultationContent,
  englishConsultationTopicQuestions,
  englishFamiliarityOptions,
} from './locales/en'

import {
  marathiConsultationContent,
  marathiConsultationTopicQuestions,
  marathiFamiliarityOptions,
} from './locales/mr'

import {
  gujaratiConsultationContent,
  gujaratiConsultationTopicQuestions,
  gujaratiFamiliarityOptions,
} from './locales/gu'

// --------------------------------------------------
// 1. Supported languages
// --------------------------------------------------

export const CONSULTATION_LANGUAGES = [
  'hi',
  'en',
  'mr',
  'gu',
] as const

export type ConsultationLanguage =
  (typeof CONSULTATION_LANGUAGES)[number]

export type ConsultationTypingLanguage =
  ConsultationLanguage

// --------------------------------------------------
// 2. Stable question identifiers
// --------------------------------------------------

export type ConsultationContentKey =
  | 'INTRO_WEEKDAYS'
  | 'INTRO_NAVAGRAHA'
  | 'INTRO_TIME'
  | 'CLARIFY_CONCERN'
  | 'NUMEROLOGY_FAMILIARITY'
  | 'PREVIOUS_NUMEROLOGIST'
  | 'TODAY_NOTE_EXPLORATION'
  | 'PRIMARY_CONCERN_EXPLORATION'
  | 'CONCERN_CLARIFICATION'

export interface ConsultationContent {
  id: ConsultationContentKey
  title: string
  question: string
  explanation: string
}

export const CONSULTATION_CONTENT_IDS = [
  'INTRO_WEEKDAYS',
  'INTRO_NAVAGRAHA',
  'INTRO_TIME',
  'CLARIFY_CONCERN',
  'NUMEROLOGY_FAMILIARITY',
  'PREVIOUS_NUMEROLOGIST',
  'TODAY_NOTE_EXPLORATION',
  'PRIMARY_CONCERN_EXPLORATION',
  'CONCERN_CLARIFICATION',
] as const satisfies readonly ConsultationContentKey[]

// --------------------------------------------------
// 3. Consultation topics
// --------------------------------------------------

export const CONSULTATION_TOPIC_IDS = [
  'career',
  'business',
  'money',
  'family',
  'relationship',
  'marriage',
  'personal_direction',
  'other',
] as const

export type ConsultationTopicId =
  (typeof CONSULTATION_TOPIC_IDS)[number]

export interface ConsultationTopicQuestions {
  opening: string
  clarification: string
}

export type ConsultationTopicResources = Record<
  ConsultationTopicId,
  ConsultationTopicQuestions
>

// --------------------------------------------------
// 4. Familiarity choices
// --------------------------------------------------

export const FAMILIARITY_CHOICE_IDS = [
  'First time',
  'Know a little',
  'Consultation before',
  'Know it quite well',
] as const

export type FamiliarityChoiceId =
  (typeof FAMILIARITY_CHOICE_IDS)[number]

export type FamiliarityChoiceResources = Record<
  FamiliarityChoiceId,
  string
>

// --------------------------------------------------
// 5. Language metadata
// --------------------------------------------------

export interface ConsultationLanguageInfo {
  code: ConsultationLanguage
  nativeName: string
  englishName: string
  locale: string
  script: 'Devanagari' | 'Latin' | 'Gujarati'
  direction: 'ltr'
  speechLocale: string
}

export const LANGUAGE_INFO: Record<
  ConsultationLanguage,
  ConsultationLanguageInfo
> = {
  hi: {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    locale: 'hi-IN',
    script: 'Devanagari',
    direction: 'ltr',
    speechLocale: 'hi-IN',
  },

  en: {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    locale: 'en-IN',
    script: 'Latin',
    direction: 'ltr',
    speechLocale: 'en-IN',
  },

  mr: {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    locale: 'mr-IN',
    script: 'Devanagari',
    direction: 'ltr',
    speechLocale: 'mr-IN',
  },

  gu: {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    locale: 'gu-IN',
    script: 'Gujarati',
    direction: 'ltr',
    speechLocale: 'gu-IN',
  },
}

// --------------------------------------------------
// 6. Default preferences
// --------------------------------------------------

export const DEFAULT_CONSULTATION_LANGUAGE:
  ConsultationLanguage = 'en'

export const DEFAULT_TYPING_LANGUAGE:
  ConsultationTypingLanguage = 'en'

// --------------------------------------------------
// 7. Native resource registries
// --------------------------------------------------

export type ConsultationLanguageResources =
  Partial<
    Record<
      ConsultationContentKey,
      ConsultationContent
    >
  >

export type ConsultationResourceRegistry =
  Partial<
    Record<
      ConsultationLanguage,
      ConsultationLanguageResources
    >
  >

export const consultationResourceRegistry:
  ConsultationResourceRegistry = {
    hi: hindiConsultationContent,
    en: englishConsultationContent,
    mr: marathiConsultationContent,
    gu: gujaratiConsultationContent,
  }

export const consultationTopicRegistry: Record<
  ConsultationLanguage,
  ConsultationTopicResources
> = {
  hi: hindiConsultationTopicQuestions,
  en: englishConsultationTopicQuestions,
  mr: marathiConsultationTopicQuestions,
  gu: gujaratiConsultationTopicQuestions,
}

export const consultationFamiliarityRegistry: Record<
  ConsultationLanguage,
  FamiliarityChoiceResources
> = {
  hi: hindiFamiliarityOptions,
  en: englishFamiliarityOptions,
  mr: marathiFamiliarityOptions,
  gu: gujaratiFamiliarityOptions,
}

// --------------------------------------------------
// 8. Language validation
// --------------------------------------------------

export function isConsultationLanguage(
  value: unknown
): value is ConsultationLanguage {
  return (
    typeof value === 'string' &&
    CONSULTATION_LANGUAGES.some(
      (language) => language === value
    )
  )
}

export function getConsultationLanguageInfo(
  language: ConsultationLanguage
): ConsultationLanguageInfo {
  return LANGUAGE_INFO[language]
}

// --------------------------------------------------
// 9. Native content retrieval
// --------------------------------------------------

export function getConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): ConsultationContent | null {
  const resource =
    consultationResourceRegistry[language]

  if (!resource) return null

  const content = resource[contentId]

  if (
    !content ||
    content.id !== contentId ||
    typeof content.title !== 'string' ||
    typeof content.question !== 'string' ||
    typeof content.explanation !== 'string' ||
    !content.title.trim() ||
    !content.question.trim() ||
    !content.explanation.trim()
  ) {
    return null
  }

  return content
}

export function hasConsultationContent(
  language: ConsultationLanguage,
  contentId: ConsultationContentKey
): boolean {
  return getConsultationContent(language, contentId) !== null
}

// --------------------------------------------------
// 10. Topic-specific native questions
// --------------------------------------------------

export function isConsultationTopicId(
  value: unknown
): value is ConsultationTopicId {
  return (
    typeof value === 'string' &&
    CONSULTATION_TOPIC_IDS.some(
      (topic) => topic === value
    )
  )
}

export function getConsultationTopicQuestions(
  language: ConsultationLanguage,
  topic: ConsultationTopicId
): ConsultationTopicQuestions | null {
  const resource =
    consultationTopicRegistry[language]?.[topic]

  if (
    !resource ||
    typeof resource.opening !== 'string' ||
    typeof resource.clarification !== 'string' ||
    !resource.opening.trim() ||
    !resource.clarification.trim()
  ) {
    return null
  }

  return resource
}

// --------------------------------------------------
// 11. Familiarity choice labels
// --------------------------------------------------

export function getFamiliarityChoiceLabel(
  language: ConsultationLanguage,
  choiceId: FamiliarityChoiceId
): string | null {
  const label =
    consultationFamiliarityRegistry[language]?.[choiceId]

  if (
    typeof label !== 'string' ||
    !label.trim()
  ) {
    return null
  }

  return label
}

// --------------------------------------------------
// 12. Guided question presentation
// --------------------------------------------------

// The question engine remains responsible for
// selecting the next question.
//
// This function only resolves display text.
// It never modifies canonical question text,
// question IDs, answers or consultation history.

export function getGuidedQuestionContent(
  language: ConsultationLanguage,
  questionKey: string | null,
  primaryTopic: string | null,
  isClarification = false
): ConsultationContent | null {
  if (!questionKey) return null

  const topic: ConsultationTopicId =
    isConsultationTopicId(primaryTopic)
      ? primaryTopic
      : 'other'

  const topicQuestions =
    getConsultationTopicQuestions(language, topic)

  if (
    isClarification ||
    questionKey === 'CONCERN_CLARIFICATION'
  ) {
    const base = getConsultationContent(
      language,
      'CONCERN_CLARIFICATION'
    )

    if (!base || !topicQuestions) return null

    return {
      ...base,
      question: topicQuestions.clarification,
    }
  }

  if (questionKey === 'PRIMARY_CONCERN_EXPLORATION') {
    const base = getConsultationContent(
      language,
      'PRIMARY_CONCERN_EXPLORATION'
    )

    if (!base || !topicQuestions) return null

    return {
      ...base,
      question: topicQuestions.opening,
    }
  }

  if (
    CONSULTATION_CONTENT_IDS.some(
      (id) => id === questionKey
    )
  ) {
    return getConsultationContent(
      language,
      questionKey as ConsultationContentKey
    )
  }

  return null
}

// --------------------------------------------------
// 13. Typing language
// --------------------------------------------------

export function getTypingInputProps(
  language: ConsultationTypingLanguage
): {
  lang: string
  dir: 'ltr'
  autoCapitalize: 'sentences'
  spellCheck: boolean
} {
  const info = LANGUAGE_INFO[language]

  return {
    lang: info.locale,
    dir: info.direction,
    autoCapitalize: 'sentences',
    spellCheck: true,
  }
}

// Device keyboard selection remains controlled
// by the user's operating system.

// --------------------------------------------------
// 14. Voice language
// --------------------------------------------------

export function getSpeechLocale(
  language: ConsultationLanguage
): string {
  return LANGUAGE_INFO[language].speechLocale
}

// Voice recognition and transcription are not
// implemented by this function.

// --------------------------------------------------
// 15. Independent preferences
// --------------------------------------------------

export interface ConsultationLanguagePreferences {
  consultationLanguage: ConsultationLanguage
  typingLanguage: ConsultationTypingLanguage
  voiceLanguage: ConsultationLanguage
}

export function createConsultationLanguagePreferences(
  preferredLanguage: ConsultationLanguage =
    DEFAULT_CONSULTATION_LANGUAGE
): ConsultationLanguagePreferences {
  return {
    consultationLanguage: preferredLanguage,
    typingLanguage: preferredLanguage,
    voiceLanguage: preferredLanguage,
  }
}

export function updateConsultationLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    consultationLanguage: language,
  }
}

export function updateTypingLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationTypingLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    typingLanguage: language,
  }
}

export function updateVoiceLanguage(
  current: ConsultationLanguagePreferences,
  language: ConsultationLanguage
): ConsultationLanguagePreferences {
  return {
    ...current,
    voiceLanguage: language,
  }
}

// --------------------------------------------------
// 16. Preserve original consultation text
// --------------------------------------------------

export function preserveConsultationText(
  text: string
): string {
  return text
}
