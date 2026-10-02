// app/numerology-test/page.tsx

import {
  runNumerologyRegressionTests,
} from '@/lib/numerology/test-cases'

export default function NumerologyTestPage() {
  const suite = runNumerologyRegressionTests()

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>TSIA Numerology V2</h1>

      <h2>Permanent Calculation Tests</h2>

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
          {suite.passed
            ? '✅ ALL TESTS PASSED'
            : '❌ TEST FAILURE'}
        </h2>

        <p>
          <strong>
            {suite.passedTests}/{suite.totalTests}
          </strong>{' '}
          tests passed
        </p>
      </div>

      {suite.results.map((test) => (
        <section
          key={test.name}
          style={{
            padding: 18,
            marginBottom: 18,
            border: '1px solid #ccc',
            borderRadius: 10,
          }}
        >
          <h3>
            {test.passed ? '✅' : '❌'}{' '}
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

          {test.errors.length > 0 && (
            <>
              <h4>Errors</h4>

              {test.errors.map(
                (error, index) => (
                  <p key={index}>
                    ❌ {error}
                  </p>
                )
              )}
            </>
          )}
        </section>
      ))}

      <hr />

      <p>
        Calculator Version:
        {' '}
        <strong>
          TSIA_V2_CALC_1.0
        </strong>
      </p>

      <p>
        These tests compare the calculator
        against independently locked expected
        TSIA results.
      </p>
    </main>
  )
}