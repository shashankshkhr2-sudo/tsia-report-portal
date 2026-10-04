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

import {
  runConclusionEngine,
} from '@/lib/numerology-intelligence/conclusionengine'

export default function V3TestPage() {
  const calc = calculateNumerologyV2({
    fullName: 'Pranita Ghode',
    dateOfBirth: '26/01/1991',
  })

  const grid = buildLoShuProvenance(calc)

  const patterns =
    evaluateStructuralPatterns(grid)

  const evidence =
    buildIntelligenceEvidence(calc)

  const engine =
    runConclusionEngine(evidence)

  const errors: string[] = []

  // -------------------------
  // Frozen V2 checks
  // -------------------------

  if (calc.mulank.final !== 8) {
    errors.push('Mulank should be 8')
  }

  if (calc.bhagyank.final !== 2) {
    errors.push('Bhagyank should be 2')
  }

  // -------------------------
  // Lo Shu provenance checks
  // -------------------------

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

  // -------------------------
  // Structural checks
  // -------------------------

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

  // -------------------------
  // Conclusion Engine checks
  // -------------------------

  if (engine.evidence.length === 0) {
    errors.push(
      'Conclusion Engine received no evidence'
    )
  }

  if (engine.conclusions.length === 0) {
    errors.push(
      'Conclusion Engine produced no conclusions'
    )
  }

  if (
    engine.developmentAssessments.length === 0
  ) {
    errors.push(
      'No development assessments produced'
    )
  }

  const invalidNeeded =
    engine.developmentAssessments.some(
      item =>
        item.neededNumberDetermined !== false
    )

  if (invalidNeeded) {
    errors.push(
      'Needed Number firewall failed'
    )
  }

  const passed = errors.length === 0

  return (
    <main
      style={{
        maxWidth: 760,
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
          ? '✅ ALL V3 ENGINE TESTS PASSED'
          : '❌ V3 ENGINE TEST FAILURE'}
      </h2>

      <p>
        Client:{' '}
        <strong>Pranita Ghode</strong>
      </p>

      <p>
        Mulank:{' '}
        <strong>
          {calc.mulank.final}
        </strong>
      </p>

      <p>
        Bhagyank:{' '}
        <strong>
          {calc.bhagyank.final}
        </strong>
      </p>

      <hr />

      <h3>Structural Engine</h3>

      <p>
        Structural Patterns:{' '}
        <strong>
          {patterns.length}/8
        </strong>
      </p>

      <p>
        Structural Evidence:{' '}
        <strong>
          {structuralEvidence.length}/8
        </strong>
      </p>

      <p>
        Golden 4-5-6:{' '}
        <strong>
          {golden?.status}
        </strong>
      </p>

      <p>
        Silver 2-5-8:{' '}
        <strong>
          {silver?.status}
        </strong>
      </p>

      <hr />

      <h3>Conclusion Engine</h3>

      <p>
        Total Evidence:{' '}
        <strong>
          {engine.evidence.length}
        </strong>
      </p>

      <p>
        Resolved Conclusions:{' '}
        <strong>
          {engine.conclusions.length}
        </strong>
      </p>

      <p>
        Development Assessments:{' '}
        <strong>
          {
            engine
              .developmentAssessments
              .length
          }
        </strong>
      </p>

      <h3>Resolved Intelligence</h3>

      {engine.conclusions.map(
        conclusion => (
          <div
            key={conclusion.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
            }}
          >
            <strong>
              {conclusion.title}
            </strong>

            <p>
              {conclusion.statement}
            </p>

            <small>
              Resolution:{' '}
              {conclusion.resolution}
              {' | '}
              Strength:{' '}
              {conclusion.strength}
            </small>
          </div>
        )
      )}

      <h3>Development Assessment</h3>

      {engine.developmentAssessments.map(
        item => (
          <p
            key={item.functionalQualityId}
          >
            Number {item.number}:{' '}
            <strong>
              {item.significance}
            </strong>
            {' — '}
            Needed Assessment Eligible:{' '}
            <strong>
              {item
                .neededNumberAssessmentEligible
                ? 'YES'
                : 'NO'}
            </strong>
          </p>
        )
      )}

      {errors.length > 0 && (
        <>
          <hr />

          <h3>Errors</h3>

          {errors.map(error => (
            <p key={error}>
              ❌ {error}
            </p>
          ))}
        </>
      )}

      <hr />

      <p>
        V3 Status:{' '}
        <strong>
          Draft Methodology Validation
        </strong>
      </p>
    </main>
  )
}