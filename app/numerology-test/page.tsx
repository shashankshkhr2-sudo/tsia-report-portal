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

type Check = {
  name: string
  passed: boolean
  error?: string
}

function runV2Checks(): Check[] {
  const checks: Check[] = []

  try {
    const calc =
      calculateNumerologyV2({
        fullName: 'Anita Goel',
        dateOfBirth: '15/03/1956',
      })

    checks.push({
      name: 'V2 Calculation',
      passed:
        calc.mulank.final === 6 &&
        calc.bhagyank.final === 3 &&
        calc.nameNumber.finalNumber === 3,
    })

    const evidence =
      buildNumerologyEvidence(calc)

    checks.push({
      name: 'V2 Evidence',
      passed:
        evidence.numbers.length === 9 &&
        evidence.rankedNumbers.length === 9,
    })

    const report =
      buildNumerologyV2ReportContent(
        calc,
        evidence
      )

    checks.push({
      name: 'V2 Report Content',
      passed:
        report.atAGlance.mulank.value ===
          '15/6' &&
        report.atAGlance.bhagyank.value ===
          '30/3' &&
        report.atAGlance.nameNumber.value ===
          '30/3',
    })

    const narrative =
      buildNumerologyV2Narrative(report)

    checks.push({
      name: 'V2 Narrative',
      passed:
        narrative.reportVersion ===
          'TSIA_NUMEROLOGY_V2' &&
        narrative.sections.length === 6,
    })
  } catch (error) {
    checks.push({
      name: 'V2 Runtime',
      passed: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    })
  }

  return checks
}

export default function NumerologyTestPage() {
  const regression =
    runNumerologyRegressionTests()

  const checks = runV2Checks()

  const passed =
    regression.passed &&
    checks.every(check => check.passed)

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>TSIA Numerology V2</h1>

      <h2>
        {passed
          ? '✅ ALL ENGINE TESTS PASSED'
          : '❌ ENGINE TEST FAILURE'}
      </h2>

      <p>
        Calculator Regression:{' '}
        <strong>
          {regression.passedTests}/
          {regression.totalTests}
        </strong>
      </p>

      {checks.map(check => (
        <div key={check.name}>
          <p>
            {check.passed ? '✅' : '❌'}{' '}
            <strong>{check.name}</strong>
          </p>

          {check.error && (
            <p>{check.error}</p>
          )}
        </div>
      ))}

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