import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildLoShuProvenance,
} from '@/lib/numerology-intelligence/loshuprovenance'

import {
  evaluateStructuralPatterns,
} from '@/lib/numerology-intelligence/structuralpatterns'

import {
  buildIntelligenceEvidence,
} from '@/lib/numerology-intelligence/evidence'

export default function V3TestPage() {
  const calc = calculateNumerologyV2({
    fullName: 'Pranita Ghode',
    dateOfBirth: '26/01/1991',
  })

  const grid =
    buildLoShuProvenance(calc)

  const patterns =
    evaluateStructuralPatterns(grid)

  const evidence =
    buildIntelligenceEvidence(calc)

  const errors: string[] = []

  if (calc.mulank.final !== 8) {
    errors.push('Mulank should be 8')
  }

  if (calc.bhagyank.final !== 2) {
    errors.push('Bhagyank should be 2')
  }

  if (
    grid.sourceGrid[1] !== 3 ||
    grid.sourceGrid[2] !== 1 ||
    grid.sourceGrid[6] !== 1 ||
    grid.sourceGrid[9] !== 2 ||
    grid.sourceGrid[8] !== 0
  ) {
    errors.push('Source Lo Shu mismatch')
  }

  if (
    grid.personalGrid[1] !== 3 ||
    grid.personalGrid[2] !== 2 ||
    grid.personalGrid[6] !== 1 ||
    grid.personalGrid[8] !== 1 ||
    grid.personalGrid[9] !== 2
  ) {
    errors.push('Personal Lo Shu mismatch')
  }

  if (
    grid.provenance[8]
      .mulankInsertion !== 1
  ) {
    errors.push(
      'Mulank provenance mismatch'
    )
  }

  if (
    grid.provenance[2]
      .bhagyankInsertion !== 1
  ) {
    errors.push(
      'Bhagyank provenance mismatch'
    )
  }

  const golden = patterns.find(
    p =>
      p.id ===
      'GOLDEN_RAJYOG_4_5_6'
  )

  const silver = patterns.find(
    p =>
      p.id ===
      'SILVER_RAJYOG_2_5_8'
  )

  if (golden?.status !== 'PARTIAL') {
    errors.push(
      'Golden should be PARTIAL'
    )
  }

  if (silver?.status !== 'PARTIAL') {
    errors.push(
      'Silver should be PARTIAL'
    )
  }

  if (
    golden?.origin !== 'NOT_COMPLETE' ||
    silver?.origin !== 'NOT_COMPLETE'
  ) {
    errors.push(
      'Partial Rajyog origin error'
    )
  }

  if (patterns.length !== 8) {
    errors.push(
      'Expected 8 structural patterns'
    )
  }

  const structuralEvidence =
    evidence.filter(
      e =>
        e.layer === 'ROW' ||
        e.layer === 'COLUMN' ||
        e.layer === 'RAJYOG'
    )

  if (structuralEvidence.length !== 8) {
    errors.push(
      'Expected 8 structural evidence items'
    )
  }

  const passed = errors.length === 0

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>
        TSIA Numerology Intelligence V3
      </h1>

      <h2>
        {passed
          ? '✅ ALL V3 TESTS PASSED'
          : '❌ V3 TEST FAILURE'}
      </h2>

      <p>
        Client: <strong>Pranita Ghode</strong>
      </p>

      <p>
        Mulank: <strong>{calc.mulank.final}</strong>
      </p>

      <p>
        Bhagyank:{' '}
        <strong>{calc.bhagyank.final}</strong>
      </p>

      <p>
        Structural Patterns:{' '}
        <strong>{patterns.length}/8</strong>
      </p>

      <p>
        Structural Evidence:{' '}
        <strong>
          {structuralEvidence.length}/8
        </strong>
      </p>

      {errors.map(error => (
        <p key={error}>❌ {error}</p>
      ))}

      <hr />

      <h3>Rajyog Check</h3>

      <p>
        Golden 4-5-6:{' '}
        <strong>{golden?.status}</strong>
      </p>

      <p>
        Silver 2-5-8:{' '}
        <strong>{silver?.status}</strong>
      </p>

      <p>
        V3 Status:{' '}
        <strong>
          Draft Methodology Validation
        </strong>
      </p>
    </main>
  )
}