// Presentation-only wording for existing and new V2 draft readings.
// No private numbers, counts, grids or interpretation mappings belong here.
export function compatibilityReadingCopy(text: string): string {
 return text
  .replace(/: this draft traditional reading explores /g, ': your numbers suggest ')
  .replace(/a shared theme of /g, 'a shared connection through ')
  .replace(/In a .+? connection, the relevant context is (.+?)\./g, 'For you, this can show up in $1.')
  .replace(/ These are possible themes, not observed behaviour\./g, '')
  .replace(/'s contribution highlights /g, ' may bring ')
  .replace(/; (.+?)'s highlights /g, ', while $1 may bring ')
  .replace(/Each may experience the other's approach as encouraging in some situations and challenging in others\./g, 'These themes offer a starting point for discussing how you support and understand each other.')
  .replace(/ The reading cannot establish how either actually behaves\./g, '')
  .replace(/Different contributions suggest scope for /g, 'Themes present in one numerical pattern and absent from the other include: ')
  .replace(/This is a possibility to recognise in your experience, rather than one person correcting a deficiency in the other\./g, 'Together, these strengths may help you support each other in different ways.')
  .replace(/Your patterns share several themes\. Similarity may feel familiar, while leaving room for different preferences remains relevant\./g, 'Your numbers share several qualities. You may find some things easy to understand about each other, even when your preferences differ.')
  .replace(/Your combined pattern introduces a draft theme of /g, 'Together, your numbers highlight ')
  .replace(/This may offer a useful lens on (.+?); it does not guarantee harmony, financial success or a particular future\./g, 'This suggests room to grow together through $1.')
  .replace(/Shared themes include /g, 'Your shared strengths may include ')
  .replace(/Their constructive expression depends on the people and circumstances, rather than the calculation alone\./g, 'How this develops depends on the choices and effort you both bring.')
  .replace(/A shared emphasis may also bring /g, 'A shared emphasis may need balance. One possibility to discuss is ')
  .replace(/ This is a discussion possibility, not a finding of conflict or a judgment about either person\. Missing themes are not evidence of a personal defect\./g, ' What feels natural to one of you may not always feel the same to the other.')
  .replace(/Differences in (.+?) may be worth exploring\. No conflict is inferred merely because your numerical patterns differ\./g, 'You may have different expectations around $1. Different approaches do not automatically mean you will clash.')
}
