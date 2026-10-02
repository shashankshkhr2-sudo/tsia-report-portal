// lib/numerology/narrativeengine.ts

import type {
  NumerologyDigit,
} from './types'

import type {
  NumerologyV2ReportContent,
  ReportNumberProfile,
  ReportDevelopmentItem,
} from './reportcontent'

export type NarrativeSection = {
  title: string
  paragraphs: string[]
}

export type NumerologyV2Narrative = {
  reportVersion: 'TSIA_NUMEROLOGY_V2'
  clientName: string
  introduction: string
  sections: NarrativeSection[]
}

function joinNatural(
  values: string[]
): string {
  const unique = [...new Set(values)]

  if (unique.length === 0) {
    return ''
  }

  if (unique.length === 1) {
    return unique[0]
  }

  if (unique.length === 2) {
    return `${unique[0]} and ${unique[1]}`
  }

  return (
    `${unique.slice(0, -1).join(', ')}, ` +
    `and ${unique[unique.length - 1]}`
  )
}

function roleText(
  profile: ReportNumberProfile
): string {
  if (profile.roles.length === 0) {
    return ''
  }

  return joinNatural(profile.roles)
}

function buildCoreParagraph(
  profile: ReportNumberProfile
): string {
  const strengths =
    joinNatural(profile.strengths)

  const role = roleText(profile)

  let text =
    `Number ${profile.number}, associated with ` +
    `${profile.graha}, contributes ${strengths}.`

  if (role) {
    text +=
      ` Its importance is reinforced through ${role}.`
  }

  if (
    profile.possibleExcess.length > 0
  ) {
    text +=
      ` When this energy becomes excessive, ` +
      `it may require balance around ` +
      `${joinNatural(profile.possibleExcess)}.`
  }

  return text
}

function buildDevelopmentParagraph(
  item: ReportDevelopmentItem
): string {
  let text =
    `Number ${item.number}, associated with ` +
    `${item.graha}, is a development area in ` +
    `the present Lo Shu pattern.`

  if (item.theme) {
    text += ` The development theme is ${item.theme}.`
  }

  if (item.areas.length > 0) {
    text +=
      ` Helpful areas to consciously develop include ` +
      `${joinNatural(item.areas)}.`
  }

  if (
    item.practicalGuidance.length > 0
  ) {
    text +=
      ` Practical focus can include ` +
      `${joinNatural(item.practicalGuidance)}.`
  }

  return text
}

function buildLoShuSection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  const present =
    content.loShu.presentNumbers.join(', ')

  const missing =
    content.loShu.missingNumbers.join(', ')

  const repeated =
    Object.entries(
      content.loShu.repeatedNumbers
    )
      .map(
        ([number, count]) =>
          `${number} × ${count}`
      )
      .join(', ')

  const paragraphs: string[] = [
    `The Personal Lo Shu grid contains the numbers ${present}.`,
  ]

  if (repeated) {
    paragraphs.push(
      `Repeated energies in the grid are ${repeated}. ` +
      `These repetitions are treated as areas of reinforcement, ` +
      `with balance considered where an energy becomes very strong.`
    )
  }

  if (missing) {
    paragraphs.push(
      `The numbers ${missing} are not present in the Personal ` +
      `Lo Shu grid. In the TSIA framework, missing numbers are ` +
      `treated as development areas rather than fixed weaknesses.`
    )
  }

  return {
    title: 'Personal Lo Shu Overview',
    paragraphs,
  }
}

function buildPatternSection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  const paragraphs: string[] = []

  for (
    const row of content.patterns.rows
  ) {
    paragraphs.push(
      `${row.name} (${row.numbers}) is ${row.status} ` +
      `with ${row.presentCount}/${row.totalCount} numbers present.`
    )
  }

  for (
    const column of content.patterns.columns
  ) {
    paragraphs.push(
      `${column.name} (${column.numbers}) is ${column.status} ` +
      `with ${column.presentCount}/${column.totalCount} numbers present.`
    )
  }

  for (
    const rajyog of
      content.patterns.rajyogs
  ) {
    paragraphs.push(
      `${rajyog.name} (${rajyog.numbers}) is ${rajyog.status} ` +
      `with ${rajyog.presentCount}/${rajyog.totalCount} numbers present.`
    )
  }

  return {
    title: 'Rows, Columns & Rajyog',
    paragraphs,
  }
}

function buildCoreSection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  return {
    title: 'Core Numerological Energies',

    paragraphs:
      content.coreNumbers.map(
        buildCoreParagraph
      ),
  }
}

function buildGrahaSection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  const top =
    content.grahaAnalysis.slice(0, 4)

  const paragraphs =
    top.map((profile) => {
      const strengths =
        joinNatural(
          profile.strengths
        )

      return (
        `${profile.graha} / Number ${profile.number} ` +
        `is reinforced in the verified evidence pattern. ` +
        `Its constructive themes include ${strengths}.`
      )
    })

  return {
    title: 'Graha Analysis',
    paragraphs,
  }
}

function buildDevelopmentSection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  return {
    title: 'Development Areas',

    paragraphs:
      content.development.map(
        buildDevelopmentParagraph
      ),
  }
}

function buildSummarySection(
  content: NumerologyV2ReportContent
): NarrativeSection {
  const strong =
    content.atAGlance
      .strongestNumbers

  const development =
    content.atAGlance
      .developmentNumbers

  const paragraphs: string[] = []

  if (strong.length > 0) {
    paragraphs.push(
      `The strongest verified numerical emphasis is associated ` +
      `with ${joinNatural(
        strong.map(String)
      )}.`
    )
  }

  if (development.length > 0) {
    paragraphs.push(
      `The main development numbers identified by the current ` +
      `evidence model are ${joinNatural(
        development.map(String)
      )}.`
    )
  }

  paragraphs.push(
    `The overall interpretation should balance the core numbers, ` +
    `Lo Shu repetitions, structural patterns and development areas ` +
    `rather than relying on any single number in isolation.`
  )

  return {
    title: 'Integrated Summary',
    paragraphs,
  }
}

export function buildNumerologyV2Narrative(
  content: NumerologyV2ReportContent
): NumerologyV2Narrative {
  const name =
    content.client.fullName

  const introduction =
    `This personalized numerology analysis for ${name} is based ` +
    `on the verified TSIA Version 2 calculation and evidence framework. ` +
    `The interpretation uses the Mulank, Bhagyank, Chaldean Name Number, ` +
    `Personal Lo Shu grid, repetitions, rows, columns and Rajyog status ` +
    `as connected evidence rather than isolated conclusions.`

  const sections: NarrativeSection[] = [
    buildCoreSection(content),
    buildLoShuSection(content),
    buildPatternSection(content),
    buildGrahaSection(content),
    buildDevelopmentSection(content),
    buildSummarySection(content),
  ]

  return {
    reportVersion:
      'TSIA_NUMEROLOGY_V2',

    clientName: name,

    introduction,

    sections,
  }
}

export function getNarrativeSection(
  narrative: NumerologyV2Narrative,
  title: string
): NarrativeSection | undefined {
  return narrative.sections.find(
    (section) =>
      section.title === title
  )
}

export function getNarrativeNumbers(
  content: NumerologyV2ReportContent
): NumerologyDigit[] {
  return [
    ...new Set([
      content.atAGlance
        .strongestNumbers,
      content.atAGlance
        .developmentNumbers,
    ].flat()),
  ]
}