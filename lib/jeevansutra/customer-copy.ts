// Presentation wording only: keep practitioner guidance and saved records intact.
export function customerGuidanceCopy(text: string): string {
  if (text.startsWith('This concern can be explored through the ')) {
    return 'Explore your personality, strengths and behavioural patterns through your numerological profile. Reflect on which themes match your experience and which practical habits you would like to develop.'
  }
  if (text.startsWith('This concern contains both personality or ')) {
    return 'Your numerological profile can help you reflect on your strengths and habits. Questions about planetary periods or future timing require additional astrological analysis through Life Path Guidance. Such analysis does not guarantee an outcome.'
  }
  if (text.startsWith('The client is asking about a current life ')) {
    return 'Numerology explores personality, strengths and behavioural patterns. It does not establish planetary periods or future event dates. Life Path Guidance provides additional traditional astrological analysis; predictions are not guarantees.'
  }
  return text
    .replace("Ask whether this description fits the client's actual experience.", 'Reflect on whether this description matches your own experience.')
    .replace('Use the client’s recorded experience to choose the next practical step.', 'Use your own experience to choose your next practical step.')
    .replace('Ask the client to confirm which themes reflect actual experience.', 'Reflect on which themes match your own experience.')
    .replaceAll('the TSIA Life Path Guidance Report', 'Life Path Guidance')
}
