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
      (item) =>
        item.name === 'Golden Rajyog'
    )

  const silver =
    report.patterns.rajyogs.find(
      (item) =>
        item.name === 'Silver Rajyog'
    )

  if (
    golden?.status !==
    expected.golden
  ) {
    errors.push(
      'Golden Rajyog mismatch'
    )
  }

  if (
    silver?.status !==
    expected.silver
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

  for (
    const title of requiredSections
  ) {
    const section =
      narrative.sections.find(
        (item) =>
          item.title === title
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

function countPassed(
  tests: TestResult[]
) {
  return tests.filter(
    (test) => test.passed
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

  const evidencePassed =
    countPassed(evidence)

  const reportPassed =
    countPassed(reports)

  const narrativePassed =
    countPassed(narratives)

  const allPassed =
    calculator.passed &&
    evidencePassed === evidence.length &&
    reportPassed === reports.length &&
    narrativePassed === narratives.length

  const testBlock = (
    title: string,
    tests: TestResult[]
  ) => (
    <>
      <h2>{title}</h2>

      {tests.map((test) => (
        <div
          key={`${title}-${test.name}`}
        >
          <p>
            {test.passed ? '✅' : '❌'}{' '}
            <strong>{test.name}</strong>
          </p>

          {test.errors.map(
            (error, index) => (
              <p key={index}>
                ❌ {error}
              </p>
            )
          )}
        </div>
      ))}
    </>
  )

  return (
    <main
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: 24,
        fontFamily:
          'Arial, sans-serif',
      }}
    >
      <h1>TSIA Numerology V2</h1>

      <h2>
        Permanent Engine Tests
      </h2>

      <div
        style={{
          padding: 20,
          border: '2px solid',
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <h2>
          {allPassed
            ? '✅ ALL ENGINE TESTS PASSED'
            : '❌ ENGINE TEST FAILURE'}
        </h2>

        <p>
          Calculator:{' '}
          <strong>
            {calculator.passedTests}/
            {calculator.totalTests}
          </strong>
        </p>

        <p>
          Evidence Engine:{' '}
          <strong>
            {evidencePassed}/
            {evidence.length}
          </strong>
        </p>

        <p>
          Report Content:{' '}
          <strong>
            {reportPassed}/
            {reports.length}
          </strong>
        </p>

        <p>
          Narrative Engine:{' '}
          <strong>
            {narrativePassed}/
            {narratives.length}
          </strong>
        </p>
      </div>

      <h2>
        Calculation Tests
      </h2>

      {calculator.results.map(
        (test) => (
          <div
            key={`calc-${test.name}`}
          >
            <p>
              {test.passed
                ? '✅'
                : '❌'}{' '}
              <strong>
                {test.name}
              </strong>
            </p>

            {test.errors.map(
              (error, index) => (
                <p key={index}>
                  ❌ {error}
                </p>
              )
            )}
          </div>
        )
      )}

      {testBlock(
        'Evidence Engine Tests',
        evidence
      )}

      {testBlock(
        'Report Content Tests',
        reports
      )}

      {testBlock(
        'Narrative Engine Tests',
        narratives
      )}

      <hr />

      <p>
        Calculator Version:{' '}
        <strong>
          TSIA_V2_CALC_1.0
        </strong>
      </p>
    </main>
  )
}