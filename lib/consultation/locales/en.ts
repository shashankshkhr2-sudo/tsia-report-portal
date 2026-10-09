/**
 * Jeevan Sutra — Native English Consultation Content
 *
 * Language: English (en-IN)
 *
 * Development Rule 001:
 * SIMPLE • FAST • SAFE • RELIABLE
 *
 * - English content is authored independently.
 * - Stable question IDs are preserved.
 * - Existing saved question text is not changed.
 * - No V2/V3 calculations are modified.
 * - Consultation decision logic remains unchanged.
 */

export const englishConsultationContent = {
  INTRO_WEEKDAYS: {
    id: 'INTRO_WEEKDAYS',
    title: 'Seven Days and the Grahas',
    question:
      'Have you ever thought about why we have seven days in a week?',
    explanation:
      'In Bharatiya Jyotish, the seven weekdays are traditionally associated with seven Grahas: Surya, Chandra, Mangal, Budh, Guru, Shukra and Shani. We know them through Ravivar, Somvar, Mangalvar, Budhvar, Guruvar, Shukravar and Shanivar. Rahu and Ketu are also part of the Navagraha system, but they are lunar nodes and do not have separate weekdays.',
  },

  INTRO_NAVAGRAHA: {
    id: 'INTRO_NAVAGRAHA',
    title: 'Nine Numbers and Navagraha',
    question:
      'Have you ever wondered why Indian numerology uses nine basic numbers?',
    explanation:
      'Indian Ank Shastra traditionally associates the numbers 1 to 9 with the Navagrahas. Number 1 represents Surya, 2 Chandra, 3 Guru, 4 Rahu, 5 Budh, 6 Shukra, 7 Ketu, 8 Shani and 9 Mangal. This is the traditional connection between Ank Shastra, Navagraha and Jyotish Shastra.',
  },

  INTRO_TIME: {
    id: 'INTRO_TIME',
    title: 'Time and the Sun',
    question:
      'What time is showing on your watch right now? Is it the same time everywhere in the world?',
    explanation:
      'The Earth rotates, and different parts of the world experience daylight at different times. India, Canada, the United States and Europe follow different time zones. Days and years are connected with celestial cycles. In Bharatiya Jyotish, celestial movements are traditionally considered when interpreting phases of human life.',
  },

  CLARIFY_CONCERN: {
    id: 'CLARIFY_CONCERN',
    title: 'Understanding the Client Concern',
    question:
      'Could you explain your concern in more detail? What is happening, and what would you most like to improve?',
    explanation:
      'Listen carefully to the client. Understand their circumstances, expectations and main concern. Do not draw definite conclusions without sufficient information. Record the client’s answer in their original words.',
  },

  NUMEROLOGY_FAMILIARITY: {
    id: 'NUMEROLOGY_FAMILIARITY',
    title: 'Familiarity with Numerology',
    question:
      'Have you come across numerology before, or is this your first experience with it?',
    explanation:
      'Understand how familiar the client is with numerology before beginning the personalized discussion.',
  },

  PREVIOUS_NUMEROLOGIST: {
    id: 'PREVIOUS_NUMEROLOGIST',
    title: 'Previous Numerology Consultation',
    question:
      'Have you consulted a numerologist before?',
    explanation:
      'If the client has consulted a numerologist previously, understand their experience without making assumptions.',
  },

  TODAY_NOTE_EXPLORATION: {
    id: 'TODAY_NOTE_EXPLORATION',
    title: "Today's Consultation",
    question:
      'Tell me a little more about what you would most like clarity on today.',
    explanation:
      'Understand the current situation and what the client expects from this consultation.',
  },

  PRIMARY_CONCERN_EXPLORATION: {
    id: 'PRIMARY_CONCERN_EXPLORATION',
    title: 'Understanding the Main Concern',
    question:
      'What would you most like clarity about today?',
    explanation:
      'Allow the client to explain their main concern in their own words.',
  },

  CONCERN_CLARIFICATION: {
    id: 'CONCERN_CLARIFICATION',
    title: 'Additional Clarification',
    question:
      'Could you explain which part of this situation is most important for us to understand?',
    explanation:
      'Ask only for the additional information needed to understand the concern. Do not treat client statements as numerological evidence.',
  },
} as const

/**
 * Topic-specific English consultation questions.
 *
 * Topic IDs are independent of the display language.
 * Opening and clarification questions are selected
 * using the existing consultation topic.
 */

export const englishConsultationTopicQuestions = {
  career: {
    opening:
      'What is the main career situation you would like clarity about today?',
    clarification:
      'Could you explain whether your concern relates mainly to your current job, income, career opportunities, or professional direction?',
  },

  business: {
    opening:
      'What is the main business situation you would like clarity about today?',
    clarification:
      'Is your main concern related to business income, customers, payments, growth, or a particular business decision?',
  },

  money: {
    opening:
      'What would you most like to understand about your current money or financial direction?',
    clarification:
      'Is your main financial concern related to income, expenses, delayed payments, savings, or financial commitments?',
  },

  family: {
    opening:
      'What part of your family situation would you most like clarity about today?',
    clarification:
      'Is your concern mainly about communication, responsibilities, relationships, or a particular family situation?',
  },

  relationship: {
    opening:
      'What part of your relationship situation would you most like clarity about today?',
    clarification:
      'Is your concern mainly about communication, emotional understanding, trust, or the future direction of the relationship?',
  },

  marriage: {
    opening:
      'What would you most like to understand about your marriage or marriage direction?',
    clarification:
      'Is your concern about finding a suitable partner, an existing marriage, family expectations, or another marriage-related situation?',
  },

  personal_direction: {
    opening:
      'What area of your personal direction feels most important for you to understand today?',
    clarification:
      'Is your main concern related to an important decision, confidence, responsibilities, or uncertainty about your next steps?',
  },

  other: {
    opening:
      'What would you most like clarity about today?',
    clarification:
      'Could you explain which part of this situation is most important for us to understand?',
  },
} as const

/**
 * English familiarity choices.
 *
 * The keys are the existing canonical values
 * used by the consultation decision engine.
 */

export const englishFamiliarityOptions = {
  'First time': 'First time',
  'Know a little': 'Know a little',
  'Consultation before': 'Consultation before',
  'Know it quite well': 'Know it quite well',
} as const

export default englishConsultationContent