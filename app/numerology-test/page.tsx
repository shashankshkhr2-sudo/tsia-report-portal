import {
  runNumerologyRegressionTests,
} from '@/lib/numerology/testcases'

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidenceengine'

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

  if (
    evidence.strongestNumbers.length < 1
  ) {
    errors.push(
      'Strongest number missing'
    )
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function runEvidenceTests() {
  const results = [
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

  const passed =
    results.filter(
      (item) => item.passed
    ).length

  return {
    results,
    passed,
    total: results.length,
  }
}

export default function NumerologyTestPage() {
  const calculator =
    runNumerologyRegressionTests()

  const evidence =
    runEvidenceTests()

  const allPassed =
    calculator.passed &&
    evidence.passed === evidence.total

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
            {evidence.passed}/
            {evidence.total}
          </strong>
        </p>
      </div>

      <h2>Calculation Tests</h2>

      {calculator.results.map(
        (test) => (
          <div key={test.name}>
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

      <h2>Evidence Engine Tests</h2>

      {evidence.results.map(
        (test) => (
          <div key={test.name}>
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

      <hr />

      <p>
        Calculator Version:{' '}
        <strong>TSIA_V2_CALC_1.0</strong>
      </p>
    </main>
  )
}