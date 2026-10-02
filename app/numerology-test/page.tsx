// app/numerology-test/page.tsx

import {
  runNumerologyRegressionTests,
} from '@/lib/numerology/testcases'

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidenceengine'

type EvidenceTestResult = {
  name: string
  passed: boolean
  errors: string[]
}

function sameNumbers(
  actual: number[],
  expected: number[]
) {
  return (
    JSON.stringify([...actual].sort()) ===
    JSON.stringify([...expected].sort())
  )
}

function runEvidenceTest(
  name: string,
  dob: string,
  expected: {
    mulank: number
    bhagyank: number
    nameNumber: number
    developmentNumbers: number[]
  }
): EvidenceTestResult {
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
    errors.push(
      `Mulank expected ${expected.mulank}, got ${evidence.coreNumbers.mulank}.`
    )
  }

  if (
    evidence.coreNumbers.bhagyank !==
    expected.bhagyank
  ) {
    errors.push(
      `Bhagyank expected ${expected.bhagyank}, got ${evidence.coreNumbers.bhagyank}.`
    )
  }

  if (
    evidence.coreNumbers.nameNumber !==
    expected.nameNumber
  ) {
    errors.push(
      `Name Number expected ${expected.nameNumber}, got ${evidence.coreNumbers.nameNumber}.`
    )
  }

  if (
    !sameNumbers(
      evidence.developmentNumbers,
      expected.developmentNumbers
    )
  ) {
    errors.push(
      `Development numbers expected ${expected.developmentNumbers.join(
        ', '
      )}, got ${evidence.developmentNumbers.join(
        ', '
      )}.`
    )
  }

  if (
    evidence.numbers.length !== 9
  ) {
    errors.push(
      `Expected 9 number profiles, got ${evidence.numbers.length}.`
    )
  }

  if (
    evidence.rankedNumbers.length !== 9
  ) {
    errors.push(
      `Expected 9 ranked numbers, got ${evidence.rankedNumbers.length}.`
    )
  }

  if (
    evidence.strongestNumbers.length === 0
  ) {
    errors.push(
      'No strongest number was identified.'
    )
  }

  return {
    name,
    passed: errors.length === 0,
    errors,
  }
}

function runEvidenceTests() {
  const tests: EvidenceTestResult[] = [
    runEvidenceTest(
      'Anita Goel',
      '15/03/1956',
      {
        mulank: 6,
        bhagyank: 3,
        nameNumber: 3,
        developmentNumbers: [
          2, 4, 7, 8,
        ],
      }
    ),

    runEvidenceTest(
      'Anushka Das',
      '29/03/1983',
      {
        mulank: 2,
        bhagyank: 8,
        nameNumber: 4,
        developmentNumbers: [
          4, 5, 6, 7,
        ],
      }
    ),
  ]

  const passedTests =
    tests.filter(
      (test) => test.passed
    ).length

  return {
    passed:
      passedTests === tests.length,

    totalTests:
      tests.length,

    passedTests,

    failedTests:
      tests.length - passedTests,

    results: tests,
  }
}

export default function NumerologyTestPage() {
  const calculatorSuite =
    runNumerologyRegressionTests()

  const evidenceSuite =
    runEvidenceTests()

  const allPassed =
    calculatorSuite.passed &&
    evidenceSuite.passed

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 24,
        fontFamily:
          'Arial, sans-serif',
      }}
    >
      <h1>
        TSIA Numerology V2
      </h1>

      <h2>
        Permanent Engine Tests
      </h2>

      <div
        style={{
          padding: 20,
          marginTop: 20,
          marginBottom: 24,
          border: '2px solid',
          borderRadius: 12,
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
            {calculatorSuite.passedTests}/
            {calculatorSuite.totalTests}
          </strong>
        </p>

        <p>
          Evidence Engine:{' '}
          <strong>
            {evidenceSuite.passedTests}/
            {evidenceSuite.totalTests}
          </strong>
        </p>
      </div>

      <h2>
        Calculation Tests
      </h2>

      {calculatorSuite.results.map(
        (test) => (
          <section
            key={`calc-${test.name}`}
            style={{
              padding: 18,
              marginBottom: 18,
              border:
                '1px solid #ccc',
              borderRadius: 10,
            }}
          >
            <h3>
              {test.passed
                ? '✅'
                : '❌'}{' '}
              {test.name}
            </h3>

            <p>
              Status:{' '}
              <strong>
                {test.passed
                  ? 'PASSED'
                  : 'FAILED'}
              </strong>
            </p>

            {test.errors.map(
              (error, index) => (
                <p key={index}>
                  ❌ {error}
                </p>
              )
            )}
          </section>
        )
      )}

      <h2>
        Evidence Engine Tests
      </h2>

      {evidenceSuite.results.map(
        (test) => (
          <section
            key={`evidence-${test.name}`}
            style={{
              padding: 18,
              marginBottom: 18,
              border:
                '1px solid #ccc',
              borderRadius: 10,
            }}
          >
            <h3>
              {test.passed
                ? '✅'
                : '❌'}{' '}
              {test.name}
            </h3>

            <p>
              Status:{' '}
              <strong>
                {test.passed
                  ? 'PASSED'
                  : 'FAILED'}
              </strong>
            </p>

            {test.errors.map(
              (error, index) => (
                <p key={index}>
                  ❌ {error}
                </p>