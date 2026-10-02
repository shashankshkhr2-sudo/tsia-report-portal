// app/numerology-test/page.tsx

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidenceengine'

function ClientTest({
  name,
  dob,
}: {
  name: string
  dob: string
}) {
  const calculation =
    calculateNumerologyV2({
      fullName: name,
      dateOfBirth: dob,
    })

  const evidence =
    buildNumerologyEvidence(calculation)

  return (
    <section
      style={{
        border: '1px solid #ccc',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
      }}
    >
      <h2>{name}</h2>
      <p>DOB: {dob}</p>

      <h3>Core Numbers</h3>

      <p>
        Mulank: <strong>
          {evidence.coreNumbers.mulank}
        </strong>
      </p>

      <p>
        Bhagyank: <strong>
          {evidence.coreNumbers.bhagyank}
        </strong>
      </p>

      <p>
        Name Number: <strong>
          {evidence.coreNumbers.nameNumber}
        </strong>
      </p>

      <h3>Strongest Number(s)</h3>

      <p>
        <strong>
          {evidence.strongestNumbers.join(', ')}
        </strong>
      </p>

      <h3>Development Numbers</h3>

      <p>
        <strong>
          {evidence.developmentNumbers.length
            ? evidence.developmentNumbers.join(', ')
            : 'None'}
        </strong>
      </p>

      <h3>Evidence Ranking</h3>

      {evidence.rankedNumbers.map(
        (item) => (
          <div
            key={item.number}
            style={{
              marginBottom: 18,
              paddingBottom: 12,
              borderBottom:
                '1px solid #eee',
            }}
          >
            <strong>
              {item.number} — {item.graha}
            </strong>

            <div>
              Internal Score: {item.score}
            </div>

            <div>
              Lo Shu Count: {item.loShuCount}
            </div>

            <div>
              Core:
              {' '}
              {item.isMulank
                ? 'Mulank '
                : ''}
              {item.isBhagyank
                ? 'Bhagyank '
                : ''}
              {item.isNameNumber
                ? 'Name Number'
                : ''}
            </div>

            {item.evidence.length > 0 && (
              <ul>
                {item.evidence.map(
                  (e, index) => (
                    <li key={index}>
                      {e.description}
                      {' '}
                      (+{e.weight})
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        )
      )}
    </section>
  )
}

export default function NumerologyTestPage() {
  return (
    <main
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>
        TSIA V2 Evidence Engine Test
      </h1>

      <p>
        Internal development test only.
        Scores will not appear in client
        reports.
      </p>

      <ClientTest
        name="Anita Goel"
        dob="15/03/1956"
      />

      <ClientTest
        name="Anushka Das"
        dob="29/03/1983"
      />
    </main>
  )
}