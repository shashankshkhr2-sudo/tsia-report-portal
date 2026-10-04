import {
  runNumerologyRegressionTests,
} from '@/lib/numerology/testcases'

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidenceengine'

import {
  buildNumerologyV2ReportContent,
} from '@/lib/numerology/reportcontent'

import {
  buildNumerologyV2Narrative,
} from '@/lib/numerology/narrativeengine'

import {
  buildLoShuProvenance,
} from '@/lib/numerology-intelligence/loshuprovenance'

import {
  evaluateStructuralPatterns,
} from '@/lib/numerology-intelligence/structuralpatterns'

import {
  buildIntelligenceEvidence,
} from '@/lib/numerology-intelligence/evidence'

type TestResult = {
  name: string
  passed: boolean
  errors: string[]
}

function sameNumbers(
  a: number[],
  b: number[]
) {
  return (
    [...a].sort().join(',') ===
    [...b].sort().join(',')
  )
}

function evidenceTest(
  name: string,
  dob: string,
  expectedDevelopment: number[]
): TestResult {
  const calculation =
    calculateNumerologyV2({
      fullName: name,
      dateOfBirth: dob,
    })

  const evidence =
    buildNumerologyEvidence(calculation)

  const errors: string[] = []

  if (
    !sameNumbers(
      evidence.developmentNumbers,
      expectedDevelopment
    )
  ) {
    errors.push(
      'Development numbers mismatch'
    )
  }

  if (evidence.numbers.length !== 9) {
    errors.push(
      'Number profile count mismatch'
    )
  }

  if (
    evidence.rankedNumbers.length !== 9
  ) {
    errors.push(
      'Ranking count mismatch'
    )
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function reportTest(
  name: string,
  dob: string,
  expected: {
    mulank: string
    bhagyank: string
    nameNumber: string
    missing: number[]
    golden: string
    silver: string
  }
): TestResult {
  const calculation =
    calculateNumerologyV2({
      fullName: name,
      dateOfBirth: dob,
    })

  const evidence =
    buildNumerologyEvidence(calculation)

  const report =
    buildNumerologyV2ReportContent(
      calculation,
      evidence
    )

  const errors: string[] = []

  if (
    report.atAGlance.mulank.value !==
    expected.mulank
  ) {
    errors.push('Mulank mismatch')
  }

  if (
    report.atAGlance.bhagyank.value !==
    expected.bhagyank
  ) {
    errors.push('Bhagyank mismatch')
  }

  if (
    report.atAGlance.nameNumber.value !==
    expected.nameNumber
  ) {
    errors.push(
      'Name Number mismatch'
    )
  }

  if (
    !sameNumbers(
      report.loShu.missingNumbers,
      expected.missing
    )
  ) {
    errors.push(
      'Missing numbers mismatch'
    )
  }

  const golden =
    report.patterns.rajyogs.find(
      item =>
        item.name === 'Golden Rajyog'
    )

  const silver =
    report.patterns.rajyogs.find(
      item =>
        item.name === 'Silver Rajyog'
    )

  if (
    golden?.status !== expected.golden
  ) {
    errors.push(
      'Golden Rajyog mismatch'
    )
  }

  if (
    silver?.status !== expected.silver
  ) {
    errors.push(
      'Silver Rajyog mismatch'
    )
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function narrativeTest(
  name: string,
  dob: string
): TestResult {
  const calculation =
    calculateNumerologyV2({
      fullName: name,
      dateOfBirth: dob,
    })

  const evidence =
    buildNumerologyEvidence(calculation)

  const report =
    buildNumerologyV2ReportContent(
      calculation,
      evidence
    )

  const narrative =
    buildNumerologyV2Narrative(report)

  const errors: string[] = []

  if (
    narrative.reportVersion !==
    'TSIA_NUMEROLOGY_V2'
  ) {
    errors.push(
      'Narrative version mismatch'
    )
  }

  if (
    narrative.clientName !== name
  ) {
    errors.push(
      'Narrative client mismatch'
    )
  }

  if (
    narrative.introduction.length < 50
  ) {
    errors.push(
      'Introduction missing'
    )
  }

  if (
    narrative.sections.length !== 6
  ) {
    errors.push(
      'Section count mismatch'
    )
  }

  const requiredSections = [
    'Core Numerological Energies',
    'Personal Lo Shu Overview',
    'Rows, Columns & Rajyog',
    'Graha Analysis',
    'Development Areas',
    'Integrated Summary',
  ]

  for (const title of requiredSections) {
    const section =
      narrative.sections.find(
        item => item.title === title
      )

    if (!section) {
      errors.push(
        `Missing section: ${title}`
      )
      continue
    }

    if (
      section.paragraphs.length < 1
    ) {
      errors.push(
        `Empty section: ${title}`
      )
    }
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function v3Test(): TestResult {
  const calculation =
    calculateNumerologyV2({
      fullName: 'Pranita Ghode',
      dateOfBirth: '26/01/1991',
    })

  const loShu =
    buildLoShuProvenance(calculation)

  const patterns =
    evaluateStructuralPatterns(loShu)

  const evidence =
    buildIntelligenceEvidence(calculation)

  const errors: string[] = []

  if (calculation.mulank.final !== 8) {
    errors.push('V3 Mulank should be 8')
  }

  if (
    calculation.bhagyank.final !== 2
  ) {
    errors.push(
      'V3 Bhagyank should be 2'
    )
  }

  const expectedSource = {
    1: 3,
    2: 1,
    6: 1,
    9: 2,
  }

  for (
    const [key, value] of
    Object.entries(expectedSource)
  ) {
    const number = Number(key) as
      keyof typeof loShu.sourceGrid

    if (
      loShu.sourceGrid[number] !== value
    ) {
      errors.push(
        `Source Lo Shu ${key} mismatch`
      )
    }
  }

  if (loShu.sourceGrid[8] !== 0) {
    errors.push(
      '8 must not exist in Source Lo Shu'
    )
  }

  if (loShu.personalGrid[8] !== 1) {
    errors.push(
      '8 must be added by Mulank'
    )
  }

  if (loShu.personalGrid[2] !== 2) {
    errors.push(
      'Personal Lo Shu must contain two 2s'
    )
  }

  if (
    loShu.provenance[8]
      .mulankInsertion !== 1
  ) {
    errors.push(
      '8 Mulank provenance mismatch'
    )
  }

  if (
    loShu.provenance[2]
      .bhagyankInsertion !== 1
  ) {
    errors.push(
      '2 Bhagyank provenance mismatch'
    )
  }

  const golden = patterns.find(
    item =>
      item.id ===
      'GOLDEN_RAJYOG_4_5_6'
  )

  const silver = patterns.find(
    item =>
      item.id ===
      'SILVER_RAJYOG_2_5_8'
  )

  if (golden?.status !== 'PARTIAL') {
    errors.push(
      'Golden structure should be PARTIAL'
    )
  }

  if (silver?.status !== 'PARTIAL') {
    errors.push(
      'Silver structure should be PARTIAL'
    )
  }

  if (
    golden?.origin !== 'NOT_COMPLETE'
  ) {
    errors.push(
      'Partial Golden must not have complete origin'
    )
  }

  if (
    silver?.origin !== 'NOT_COMPLETE'
  ) {
    errors.push(
      'Partial Silver must not have complete origin'
    )
  }

  if (
    golden?.completedByInsertion
      .length !== 0 ||
    silver?.completedByInsertion
      .length !== 0
  ) {
    errors.push(
      'Partial Rajyog must not report completion by insertion'
    )
  }

  const structuralEvidence =
    evidence.filter(
      item =>
        item.layer === 'ROW' ||
        item.layer === 'COLUMN' ||
        item.layer === 'RAJYOG'
    )

  if (
    structuralEvidence.length !== 8
  ) {
    errors.push(
      'Expected exactly 8 structural evidence objects'
    )
  }

  return {
    name:
      'Pranita Ghode — V3 Provenance & Structures',
    passed: errors.length === 0,
    errors,
  }
}

function countPassed(
  tests: TestResult[]
) {
  return tests.filter(
    test => test.passed
  ).length
}

export default function NumerologyTestPage() {
  const calculator =
    runNumerologyRegressionTests()

  const evidence = [
    evidenceTest(
      'Anita Goel',
      '15/03/1956',
      [2, 4, 7, 8]
    ),
    evidenceTest(
      'Anushka Das',
      '29/03/1983',
      [4, 5, 6, 7]
    ),
  ]

  const reports = [
    reportTest(
      'Anita Goel',
      '15/03/1956',
      {
        mulank: '15/6',
        bhagyank: '30/3',
        nameNumber: '30/3',
        missing: [2, 4, 7, 8],
        golden: 'partial',
        silver: 'absent',
      }
    ),
    reportTest(
      'Anushka Das',
      '29/03/1983',
      {
        mulank: '29/2',
        bhagyank: '35/8',
        nameNumber: '31/4',
        missing: [4, 5, 6, 7],
        golden: 'absent',
        silver: 'partial',
      }
    ),
  ]

  const narratives = [
    narrativeTest(
      'Anita Goel',
      '15/03/1956'
    ),
    narrativeTest(
      'Anushka Das',
      '29/03/1983'
    ),
  ]

  const v3 = [v3Test()]

  const evidencePassed =
    countPassed(evidence)

  const reportPassed =
    countPassed(reports)

  const narrativePassed =
    countPassed(narratives)

  const v3Passed =
    countPassed(v3)

  const allPassed =
    calculator.passed &&
    evidencePassed === evidence.length &&
    reportPassed === reports.length &&
    narrativePassed === narratives.length &&
    v3Passed === v3.length

  const testBlock = (
    title: string,
    tests: TestResult[]
  ) => (
    <>
      <h2>{title}</h2>

      {tests.map(test => (
        <div
          key={`${title}-${test.name}`}
        >
          <p>
            {test.passed ? '✅' : '❌'}{' '}
            <strong>{test.name}</strong>
          </p>

         
              </