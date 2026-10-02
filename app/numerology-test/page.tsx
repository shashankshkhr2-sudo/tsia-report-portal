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
  expected: {
    mulank: number
    bhagyank: number
    nameNumber: number
    development: number[]
  }
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
    evidence.coreNumbers.mulank !==
    expected.mulank
  ) {
    errors.push('Mulank mismatch')
  }

  if (
    evidence.coreNumbers.bhagyank !==
    expected.bhagyank
  ) {
    errors.push('Bhagyank mismatch')
  }

  if (
    evidence.coreNumbers.nameNumber !==
    expected.nameNumber
  ) {
    errors.push('Name Number mismatch')
  }

  if (
    !sameNumbers(
      evidence.developmentNumbers,
      expected.development
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

function reportContentTest(
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
    report.reportVersion !==
    'TSIA_NUMEROLOGY_V2'
  ) {
    errors.push(
      'Report version mismatch'
    )
  }

  if (
    report.client.fullName !== name
  ) {
    errors.push(
      'Client name mismatch'
    )
  }

  if (
    report.atAGlance.mulank.value !==
    expected.mulank
  ) {
    errors.push(
      'Report Mulank mismatch'
    )
  }

  if (
    report.atAGlance.bhagyank.value !==
    expected.bhagyank
  ) {
    errors.push(
      'Report Bhagyank mismatch'
    )
  }

  if (
    report.atAGlance.nameNumber.value !==
    expected.nameNumber
  ) {
    errors.push(
      'Report Name Number mismatch'
    )
  }

  if (
    !sameNumbers(
      report.loShu.missingNumbers,
      expected.missing
    )
  ) {
    errors.push(
      'Report missing numbers mismatch'
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

  if (
    report.coreNumbers.length < 1
  ) {
    errors.push(
      'Core number profiles missing'
    )
  }

  if (
    report.grahaAnalysis.length < 1
  ) {
    errors.push(
      'Graha analysis missing'
    )
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function runEvidenceTests() {
  return [
    evidenceTest(
      'Anita Goel',
      '15/03/1956',
      {
        mulank: 6,
        bhagyank: 3,
        nameNumber: 3,
        development: [2, 4, 7, 8],
      }
    ),

    evidenceTest(
      'Anushka Das',
      '29/03/1983',
      {
        mulank: 2,
        bhagyank: 8,
        nameNumber: 4,
        development: [4, 5, 6, 7],
      }
    ),
  ]
}

function runReportTests() {
  return [
    reportContentTest(
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

    reportContentTest(
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

  const evidence =
    runEvidenceTests()

  const reports =
    runReportTests()

  const evidencePassed =
    countPassed(evidence)

  const reportPassed =
    countPassed(reports)

  const allPassed =
    calculator.passed &&
    evidencePassed === evidence.length &&
    reportPassed === reports.length

  const showTests = (
    title: string,
    tests: TestResult[]
  ) => (
    <>
      <h2>{title}</h2>

      {tests.map((test) => (
        <div key={`${title}-${test.name}`}>
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
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>TSIA Numerology V2</h1>

      <h2>Permanent Engine Tests</h2>

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
      </div>

      <h2>Calculation Tests</h2>

      {calculator.results.map(
        (test) => (
          <div key={`calc-${test.name}`}>
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
        )
      )}

      {showTests(
        'Evidence Engine Tests',
        evidence
      )}

      {showTests(
        'Report Content Tests',
        reports
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