// app/numerology-test/page.tsx

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  validateNumerologyV2,
} from '@/lib/numerology/validation'

export default function NumerologyTestPage() {
  const result = calculateNumerologyV2({
    fullName: 'Anita Goel',
    dateOfBirth: '15/03/1956',
  })

  const validation =
    validateNumerologyV2(result)

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>TSIA V2 Calculator Test</h1>

      <h2>Anita Goel</h2>
      <p>DOB: 15/03/1956</p>

      <hr />

      <h3>Core Numbers</h3>

      <p>
        <strong>Mulank:</strong>{' '}
        {result.mulank.compound} →{' '}
        {result.mulank.final}
      </p>

      <p>
        <strong>Bhagyank:</strong>{' '}
        {result.bhagyank.compound} →{' '}
        {result.bhagyank.final}
      </p>

      <p>
        <strong>Name Number:</strong>{' '}
        {result.nameNumber.compoundTotal} →{' '}
        {result.nameNumber.finalNumber}
      </p>

      <h3>Chaldean Name Calculation</h3>

      {result.nameNumber.words.map((word) => (
        <div key={word.word}>
          <strong>{word.word}</strong>
          {' = '}
          {word.letters
            .map(
              (item) =>
                `${item.letter}${item.value}`
            )
            .join(' + ')}
          {' = '}
          {word.total}
        </div>
      ))}

      <h3>Personal Lo Shu Counts</h3>

      <pre>
        {JSON.stringify(
          result.loShu.counts,
          null,
          2
        )}
      </pre>

      <p>
        <strong>Present:</strong>{' '}
        {result.loShu.presentNumbers.join(', ')}
      </p>

      <p>
        <strong>Missing:</strong>{' '}
        {result.loShu.missingNumbers.join(', ')}
      </p>

      <p>
        <strong>Repeated:</strong>{' '}
        {JSON.stringify(
          result.loShu.repeatedNumbers
        )}
      </p>

      <h3>Rows</h3>
      <pre>
        {JSON.stringify(
          result.rows,
          null,
          2
        )}
      </pre>

      <h3>Columns</h3>
      <pre>
        {JSON.stringify(
          result.columns,
          null,
          2
        )}
      </pre>

      <h3>Rajyog</h3>
      <pre>
        {JSON.stringify(
          result.rajyog,
          null,
          2
        )}
      </pre>

      <hr />

      <h2>
        Validation: {validation.status}
      </h2>

      {validation.checks.map((check) => (
        <p key={check.name}>
          {check.passed ? '✅' : '❌'}{' '}
          <strong>{check.name}:</strong>{' '}
          {check.message}
        </p>
      ))}

      <hr />

      <p>
        Calculator Version:{' '}
        {result.calculationVersion}
      </p>
    </main>
  )
}