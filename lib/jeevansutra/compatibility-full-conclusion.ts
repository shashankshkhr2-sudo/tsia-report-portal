import 'server-only'
import { calculateCompatibility } from './compatibility-engine'
import { launchRelationshipGuidance } from './compatibility-launch-options'

type Person = { name: string; dob: string }

const themes: Record<number, string> = {
  1: 'taking initiative',
  2: 'noticing how others feel',
  3: 'bringing ideas into the conversation',
  4: 'giving plans structure',
  5: 'adapting as things change',
  6: 'showing care through practical support',
  7: 'taking time to reflect',
  8: 'following through on responsibilities',
  9: 'acting on what matters to you',
}

const contexts: Record<string, [string, string]> = {
  'Dating / getting to know each other': ['getting to know each other at a comfortable pace', 'how often to meet or stay in touch'],
  'In a relationship': ['making room for honest conversations and care', 'when to talk things through and when to give each other space'],
  'Live-in relationship': ['building everyday routines that work for both of you', 'chores, spending and personal space'],
  Friends: ['building trust and showing up for each other', 'whether someone wants advice, company or space'],
  'Considering marriage': ['discussing what everyday life together could look like', 'money, family involvement and future plans'],
  Married: ['supporting each other as routines and responsibilities change', 'how to share the work that keeps everyday life running'],
  'Business partners': ['sharing ownership and following through on agreements', 'who approves spending and who owns each decision'],
  'Co-founders': ['turning ideas into decisions and following through on them', 'who has the final say when time is short'],
  Colleagues: ['coordinating shared work and helping each other meet deadlines', 'when to hand off work and how to raise concerns'],
  'Manager / team member': ['building trust through clear expectations and feedback', 'what a useful check-in looks like to each of you'],
  'Professional contacts': ['finding a shared interest and following up respectfully', 'how much time or help each person can offer'],
  'Crush / exploring a connection': ['getting to know each other without assuming interest', 'how to express interest and respect the other person’s pace'],
  'Parent / child': ['offering support while making room for independence', 'when advice feels helpful and when it feels like pressure'],
  Siblings: ['supporting each other as family roles change', 'who is expected to step in when family needs arise'],
  'Mother-in-law / daughter-in-law': ['including each other while respecting personal space', 'visits, advice and family traditions'],
  'Father-in-law / son-in-law': ['showing respect for each other’s role in the family', 'when to offer advice and when to ask to be consulted'],
  'Other family members': ['keeping in touch in a way that works for both of you', 'what kind of support each person can offer'],
}

export function fullCompatibilityConclusion(
  kind: string, relationship: string, self: Person, other: Person,
): [string, string, string] {
  const guidance = launchRelationshipGuidance(kind, relationship)
  if (!guidance || !Object.prototype.hasOwnProperty.call(contexts, relationship)) {
    throw new Error('Unsupported relationship for full compatibility.')
  }
  const [strengthContext, frictionContext] = contexts[relationship]
  const facts = calculateCompatibility({ self, other })
  const a = themes[facts.a.mulank.final]
  const b = themes[facts.b.mulank.final]
  const shared = facts.shared.find(n => n !== facts.a.mulank.final && n !== facts.b.mulank.final)
  const onlyA = facts.onlyA[0]
  const onlyB = facts.onlyB[0]
  const completedTogether = facts.lines.some(line => line.source === 'together')
  const sameLongTerm = facts.a.bhagyank.final === facts.b.bhagyank.final

  const individual = a === b
    ? 'You may both recognise a tendency toward ' + a + '.'
    : self.name + ' may lean toward ' + a + ', while ' + other.name + ' may lean toward ' + b + '.'
  const together = shared !== undefined
    ? 'A possible area of common ground is ' + themes[shared] + '.'
    : onlyA !== undefined && onlyB !== undefined
      ? 'You may complement each other through ' + themes[onlyA] + ' and ' + themes[onlyB] + '.'
      : 'Look for the situations where your approaches already work well together.'
  const connection = individual + ' ' + together + ' See how this shows up in ' + strengthContext + '.'
  const difference = 'Talk about ' + frictionContext + '. ' + (sameLongTerm
    ? 'Even when you agree on the bigger picture, check what each of you expects day to day.'
    : 'You may give different priorities more weight over time, so make those expectations explicit.')
  const action = guidance[1] + (completedTogether
    ? ' Afterwards, notice what worked better because each of you contributed something different.'
    : '')
  return [connection, difference, action]
}


const detailedPersonalityCopy: Record<number, { nature: string; support: string }> = {
  "1": {
    "nature": "You may like taking the first step and deciding how to move ahead. Having a say in decisions can matter to you. For example, when a plan is unclear, you may prefer suggesting a solution instead of waiting.",
    "support": "Explain what you want, but also ask what the other person thinks. If they suggest another way, hear them out before deciding. A different opinion need not mean they doubt your ability."
  },
  "2": {
    "nature": "You may notice the way something is said as much as the words themselves. A warm reply or a small sign of care may mean a lot to you. When someone sounds distant, you may want to understand whether something is wrong.",
    "support": "Ask gently instead of assuming that a short reply means someone is upset with you. Say when something has hurt you. Keeping quiet only to avoid an argument can leave the other person unaware of your needs."
  },
  "3": {
    "nature": "You may enjoy sharing ideas, talking things through and bringing some lightness into a situation. Being heard and appreciated can matter to you. You may show interest by offering suggestions or helping someone see another possibility.",
    "support": "Before giving advice, ask whether the other person wants ideas or simply wants you to listen. Give them time to finish. Follow up on the small things you promise, so your care is seen in your actions too."
  },
  "4": {
    "nature": "You may feel more comfortable when plans and responsibilities are clear. You may notice practical details that others miss. For example, before agreeing to something, you may want to know how it will work and who will handle each part.",
    "support": "Explain why a detail matters instead of expecting the other person to understand automatically. Leave some room for changes. A different way of doing something can still work, even when it is not the way you first planned."
  },
  "5": {
    "nature": "You may enjoy variety, fresh conversations and the freedom to adjust plans. You may be comfortable finding another way when things change. Too many fixed expectations may feel tiring if you have had no say in them.",
    "support": "Tell the other person when your plans change, especially if they are depending on you. Be clear about the promises you can keep. Personal freedom and being reliable can go together."
  },
  "6": {
    "nature": "You may show care by helping, checking on someone or taking responsibility. You may notice what needs attention and step in without being asked. Feeling that your effort is valued can matter as much as receiving help yourself.",
    "support": "Ask what help is wanted before taking over. Say when you need support too. Doing everything yourself can leave you tired and the other person unsure of how to contribute."
  },
  "7": {
    "nature": "You may prefer some time to think before sharing what you feel. A quiet conversation may suit you better than being asked to explain everything immediately. You may want to understand a situation properly before giving an answer.",
    "support": "If you need time, say so and agree when you will return to the conversation. This helps the other person understand your silence. Share a little of what you are thinking instead of expecting them to guess."
  },
  "8": {
    "nature": "You may take commitments seriously and show care by being dependable. You may pay attention to effort, responsibilities and whether plans are moving forward. When something matters, you may prefer practical action over repeated promises.",
    "support": "Along with discussing what needs to be done, ask how the other person is feeling. Appreciate their effort even when their pace is different. Share the responsibility instead of carrying it all or deciding everything yourself."
  },
  "9": {
    "nature": "You may care strongly about what feels right and be ready to act when someone needs support. You may speak with feeling when a matter is important to you. Your wish to help can bring energy to a difficult situation.",
    "support": "Pause before replying when you feel strongly. Ask what the other person meant before reacting to their words. Offer help in a way they are comfortable receiving, and leave room for their own choices."
  }
};


const detailedLineCopy: Record<string, string> = {
  "row_492": "Planning together may be a useful strength to explore. Before making a decision, discuss what each of you wants and what practical arrangements are needed. For example, one person can suggest the options while the other checks the details. Make sure both have a say in the final choice.",
  "row_357": "Talking about experiences may help you understand each other better. After an important conversation or a difficult day, ask what felt good and what was troubling. Listen before offering a solution. The same event can affect each person differently, so leave room for both views.",
  "row_816": "Your connection may benefit from turning care into everyday action. Small things such as keeping a promise, helping with a task or checking in at the agreed time can build trust. Discuss who will do what, instead of assuming the other person will notice everything that needs attention.",
  "column_438": "Working steadily towards a shared task may be a useful area to explore. Break a large responsibility into smaller steps and agree who will handle each one. If someone falls behind, discuss what support is needed. A practical plan works better when both people feel involved.",
  "column_951": "Following through on a shared decision may be a useful strength to explore. First check that both of you actually want the same outcome. Then agree on a realistic next step. Staying committed is helpful, but leave room to change a plan when circumstances or needs change.",
  "column_276": "Thoughtful support may be an important theme to explore. Ask whether the other person wants you to listen, offer advice or help with a task. For example, a quiet conversation may help more than immediately trying to fix everything. Let each person explain what support means to them.",
  "golden_456": "This traditional pattern brings attention to making plans, adjusting when needed and handling responsibilities together. In daily life, try setting one shared goal and discussing the time, effort and resources each person can give. Keep the arrangement fair and review it when circumstances change. This pattern does not promise money, status or success.",
  "silver_258": "This traditional pattern brings attention to cooperation, adjusting to each other and being dependable. In daily life, this can mean listening to a different view while still keeping an agreed commitment. If one person needs a change, discuss it early and decide together. This pattern does not guarantee an easy relationship."
};


export function detailedCompatibilitySections(kind: string, relationship: string, self: Person, other: Person): { title: string; text: string }[] {
 const guidance = launchRelationshipGuidance(kind, relationship);
 if (!guidance || !Object.prototype.hasOwnProperty.call(contexts, relationship)) throw new Error("Unsupported relationship for detailed compatibility.");
 const facts = calculateCompatibility({ self, other });
 const [strengthContext, frictionContext] = contexts[relationship];
 const sections: { title: string; text: string }[] = [];
 const add = (title: string, paragraphs: string[]) => sections.push({ title, text: paragraphs.filter(Boolean).join("\n\n") });
 const describe = (numbers: number[]) => numbers.map(n => themes[n]).join(", ");
 const people = [{ person: self, result: facts.a, first: true }, { person: other, result: facts.b, first: false }];
 for (const { person, result, first } of people) {
  const copy = detailedPersonalityCopy[result.mulank.final];
  add("Understanding " + person.name, [person.name + ", " + copy.nature.charAt(0).toLowerCase() + copy.nature.slice(1), copy.support]);
  const present = Object.keys(result.loShu.counts).map(Number).filter(n => result.loShu.counts[n as keyof typeof result.loShu.counts] > 0);
  const personalLines = facts.lines.filter(line => first ? line.inA : line.inB);
  add("What " + person.name + " brings", ["This individual reading brings attention to " + describe(present) + ". Look at which of these themes you recognise in everyday life. They are starting points for reflection, rather than a complete description of your personality.", ...personalLines.map(line => person.name + ": your individual pattern highlights " + line.theme + ". Consider how you express this in daily life and which parts fit your experience. The following suggestion explores how you could bring this quality into the relationship: " + detailedLineCopy[line.id]).filter(Boolean), "In this relationship, consider how these qualities can help with " + strengthContext + ". Ask the other person which kind of support they actually find useful."]);
 }
 const sameDirection = facts.a.bhagyank.final === facts.b.bhagyank.final;
 add("What matters to each of you", [self.name + ": this part of the reading brings attention to " + themes[facts.a.bhagyank.final] + ". " + other.name + ": it brings attention to " + themes[facts.b.bhagyank.final] + ".", sameDirection ? "You share this theme, but you may express it differently. Talk about what it means to each of you instead of assuming that your expectations are the same." : "These different themes can give you useful things to discuss. Ask what each person wants to give more time to and where support would help. A difference in priorities does not by itself mean that you are incompatible.", "For your selected relationship, discuss " + frictionContext + ". Use one real situation so that both of you know what you are agreeing to."]);
 add("Where you connect", [facts.shared.length ? "Your individual readings share themes of " + describe(facts.shared) + ". These may offer familiar ground for understanding each other. For example, talk about a recent occasion when you felt supported and ask what made that moment work." : "The individual readings do not share the same number themes. That does not mean you cannot connect. Look at your actual conversations, shared interests and the ways you make time for each other.", "For " + relationship + ", explore this through " + strengthContext + ". A shared quality becomes useful when both people express it in a way the other person appreciates."]);
 add("How you can support each other", [facts.onlyA.length ? self.name + " brings distinct themes of " + describe(facts.onlyA) + "." : self.name + " has no separate number theme that is absent from the other reading. This does not mean both people behave alike.", facts.onlyB.length ? other.name + " brings distinct themes of " + describe(facts.onlyB) + "." : other.name + " has no separate number theme that is absent from the other reading. Each person still has their own experience and preferences.", "Try sharing one responsibility according to what each person is comfortable handling. Ask before stepping in. A quality shown in one reading does not make that person responsible for doing all the work in that area."]);
 const combinedLines = facts.lines.filter(line => line.complete);
 add("What you can bring together", combinedLines.length ? combinedLines.map(line => {
  const source = line.source === "together" ? "This theme appears when your contributions are considered together." : line.source === "both" ? "This theme is present in both individual readings." : "This theme is already present in the individual reading of " + (line.source === "person_a" ? self.name : other.name) + ".";
  return source + " " + detailedLineCopy[line.id];
 }) : ["No complete combined line appears in this reading. This is not a negative verdict on your relationship. Look at the individual strengths described above and choose one practical way to support each other. Trust grows through your behaviour and experience together."]);
 add("Where extra care may help", [facts.missing.length ? "The combined reading does not include themes of " + describe(facts.missing) + ". This does not mean either person lacks these qualities. You can use these areas as discussion points and decide whether any of them need more attention in your actual relationship." : "All number themes are represented in the combined reading. This does not remove misunderstandings or guarantee compatibility. Both people still need to communicate and follow through.", "Pay particular attention to " + frictionContext + ". Say what you can manage and what you need help with. Do not wait for the other person to guess.", "If a disagreement comes up, discuss one issue at a time. Explain what happened and how it affected you, then let the other person explain their side."]);
 add("Small steps for both of you", [self.name + ": " + detailedPersonalityCopy[facts.a.mulank.final].support, other.name + ": " + detailedPersonalityCopy[facts.b.mulank.final].support, guidance[1] + " After trying this, ask what helped and what needs to change. Keep the arrangement comfortable for both people."]);
 add("Your overall compatibility", ["For " + relationship + ", this reading considers both personalities, both individual patterns and what appears when they are brought together.", facts.shared.length ? "A possible starting point for connection is " + describe(facts.shared) + ". Build on this through " + strengthContext + "." : "Start with understanding the different qualities each person brings. Make time to discover what support feels useful to each of you.", "The area to discuss openly is " + frictionContext + ". " + (sameDirection ? "Even with a shared broader theme, everyday expectations need to be spoken about." : "Make room for different priorities and agree how you will handle decisions that affect both of you."), "Use this as a traditional numerology reading for reflection. It cannot establish another persons feelings or predict how the relationship will turn out. Your choices, communication, respect and everyday actions matter."]);
 return sections;
}
