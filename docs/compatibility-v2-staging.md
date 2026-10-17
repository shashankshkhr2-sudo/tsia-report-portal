# Jeevan Sutra compatibility V2 — staging draft

Approved scope: customer readings describe how the pair relates, influences and complements each other, shared potential and possible difficulties. Personalised behaviours and shared habits belong to the assigned practitioner's consultation workspace.

Packages displayed as coming soon: three standard tests for INR 299; six for INR 499. Three launch previews remain the only enabled allowance. This patch does not accept payments or grant purchased credits; those require a separately tested payment webhook and atomic credit ledger.

## Deployment order

1. Apply the patch and run `npx tsc --noEmit`, `node scripts/verify-compatibility-v2.cjs`, and `git diff --check`.
2. Run `migrations/20261018_compatibility_v2_draft.sql` ONCE in the Jeevan Sutra STAGING Supabase SQL Editor. It depends on the existing compatibility-launch and client-assignment migrations. It adds a private table and two functions. It does not delete or rewrite old records.
3. Deploy the `admin-applications` Preview branch.
4. In Vercel Preview environment ONLY, set `JS_COMPATIBILITY_V2_DRAFT_ENABLED=true`; retain the existing `JS_CUSTOMER_GUIDANCE_ENABLED=true`. Redeploy Preview.
5. Draft generation requires `VERCEL_ENV=preview`. It is hard-disabled in production. No approval flag can silently turn these draft tables into a final production product.

## Test with authorised staging accounts

- Create a Family comparison, select an exact relationship, supply each person's role and both DOBs; choose zero to three priorities. Four priorities, invalid dates, absent permission and invalid category/subtype combinations must fail server validation.
- Saved draft readings contain five descriptive sections. No practical behavioural section, number counts, names of grids, raw source DOBs, internal guidance or numeric calculations are returned by the customer API.
- A draft reading is visibly labelled. Existing production-shaped legacy results still reopen; their stored data is not rewritten, but customer API output removes numeric details and practical advice.
- Existing staging previews count toward the same three-preview allowance. No deletion, reset or extra draft entitlement is performed. Reusing identical category, subtype and people snapshots returns the first saved result without another credit. Changed roles/priorities alone do not regenerate it; the original context is preserved. A changed person, DOB or category/subtype is a new draft comparison.
- Verify direct navigation to each selected saved reading, including selecting the same result twice. Honour reduced-motion settings.
- Open `/practitioner/compatibility` from the portal's Client Compatibility menu. Active authorised staff in the Jeevan Sutra organisation see assigned-client comparisons; organisation administrators may see unassigned clients. Test assigned staff, another staff member, customer, inactive staff, signed-out and different-organisation accounts against the RPC directly as well as the page.
- The database's `can_access_assigned_client` function enforces assignment. The new security-definer RPC repeats active profile/organisation checks. Private tables grant no direct access to authenticated customers or staff; guidance is returned only through the checked RPC.
- Old reports display as legacy; missing source DOBs are not guessed or reconstructed. New reports provide six draft internal sections, client-reported context, discussion prompts and rule-review limitations. Raw grid counts are not displayed in the practitioner workspace either.
- Simultaneous saves and retries require real staging database testing: both V1 and V2 use the same advisory lock; the result and private source/guidance save in one transaction.

## Interpretation status

All number themes, line meanings and suggested habits are DRAFT conventions. Pair-specific Mulank/Bhagyank tables, combined repetition thresholds and name-pair interpretations are explicitly pending. Do not claim they are implemented or practitioner-approved. Customer priorities are stored and shown to the practitioner; they do not change arithmetic or pretend to validate numerology.

Each personal count = non-zero DOB digits plus final Mulank and final Bhagyank. Name numbers are separate. The combined calculation retains both contributions and classifies eight lines as incomplete, person A, person B, both, or newly completed together. No universal combined-count excess threshold or percentage is assigned.

Akhand/Shiny regression: combined counts 1:6, 2:3, 3:0, 4:0, 5:2, 6:1, 7:0, 8:1, 9:5. Silver 2-5-8 newly completes together; 8-1-6 belongs to Akhand; 9-5-1 belongs to Shiny; Golden 4-5-6 remains incomplete.

## Rollback

Unset the Preview draft flag and redeploy to restore legacy generation without deleting saved data. Draft customer entries are hidden while draft mode is off, but still count toward the staging allowance. Keep the additive SQL migration and private records. Never reset client data for testing.

## Remaining launch work

Approve interpretation tables; improve pair-specific and context-sensitive interpretation from reviewed examples; connect payment/credits; test authorisation with real staging roles and concurrent requests; check mobile/desktop layouts; verify production database/environment isolation before any production release. Retention/deletion, separate marketing consent and optional feedback are not introduced by this patch.
