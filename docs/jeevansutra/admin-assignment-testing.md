# Admin client assignment — staging review

Baseline: supplied source archive for b4e9749. No live configuration or database was changed.

## Included

Admin and Super Admin share an organisation-scoped Clients & assignments screen. Ordinary employees keep their assigned-client screen. Tabs: awaiting assignment, website clients, all active clients, assigned clients, employee settings, latest 100 assignment changes. Website status comes from an existing js_customer_access mapping, not a guess from missing phone/source fields. Existing client records are reused.

Employee identity is the existing profiles.id (Auth UUID), displayed in full; this update does not generate a separate human-readable employee number or create Auth users. Staff profile creation UI and separate Super Admin permission-management dashboard are not included.

Availability defaults to false; administrator explicitly enables each active employee and sets capacity. Admin/Super Admin/customer accounts are excluded from practitioner suggestions. Capacity means number of active assigned clients, not session hours or current bookings. Expertise is displayed from specialization but is NOT used to claim a client match. Language and requested-service preferences are not yet collected for matching.

Suggestions rank eligible employees by active-client count, then UUID for stable ties. “Let system assign” performs the same selection server-side on demand. It is initiated by an Admin and recorded as system selection with the initiating account. Automatic assignment following website registration, schedules, service/skill/language matching, and fairness rotation are future work.

Manual assignments require eligibility and available capacity. Reasons are mandatory. Automatic selection never overwrites an existing assignment. The RPC serialises assignment/settings actions per organisation and checks expected previous assignment to reject stale edits. Existing separate client-creation flows are not part of that workload lock.

Client creation now blocks customer/empty-role accounts and prevents ordinary employees from selecting someone else through the server action. Existing Add Client behaviour otherwise remains. The migration adds restrictive client SELECT/UPDATE policies to enforce assigned-only employee access at database level, alongside existing organisation and staff policies. The assignment trigger requires authorised audited updates. Review interactions with any other deployed functions/triggers before applying.

## Deployment order

1. Confirm the exact test deployment and its Supabase URL/key scopes point to staging. Current environment settings alone do not prove older deployment configuration. Keep main records intact.
2. Confirm staging has the baseline schema/migrations, Auth users, employee profiles and matching organisation configuration. Inspect profiles constraints before inserting fixtures. A profile alone is not a login account.
3. Back up staging and inspect existing policies/functions/triggers, including any migrations newer than this baseline. This migration is one-time, not idempotent.
4. Apply migrations/20261016_client_assignment.sql to verified staging only. It creates settings/history/RPCs and restrictive policies; it does not reassign existing clients.
5. Deploy the patch to the verified staging target. If the migration is absent or permissions fail, the Admin screen displays an error, not a misleading empty queue.
6. Create fictional test accounts using Supabase Auth dashboard, then matching profiles using the actual schema. Use two ordinary employees, one Admin and one customer in the same test organisation; use another organisation for access-boundary checks. Do not use real customer data or insert passwords into profile rows.
7. Seed fictional clients in staging with and without assignments. To label website fixtures, use the existing customer mapping with a valid staging Auth account and matching organisation. Preserve real main records.

## Required database and browser tests (NOT executed here)

- Admin sees all active organisation clients and exact website-mapped clients, newest registration first. An inactive client is excluded. Other-organisation clients are excluded.
- Super Admin receives the same management screen. Ordinary employee cannot call dashboard/settings/assignment RPCs and sees only own assigned clients, including through direct REST queries. Customer/anonymous access denied.
- No staff accounts: show an explicit empty roster and no suggestions. Admin cannot be selected as practitioner.
- Availability off, inactive or full-capacity: no suggestion and server rejects attempted selection. Enable availability and verify the roster refreshes.
- Admin manually assigns a fictional website client: original client ID and customer mapping stay unchanged; assigned employee sees it after reload; other employee does not.
- Reassign with reason: old/new practitioner and actor appear in history. Previous employee loses access after reload.
- Two Admin sessions change the same client: stale expected assignment rejected. Two assignment actions targeting last capacity slot: only one succeeds. Verify transaction rollback if history insertion fails.
- System selection chooses lowest workload; UUID tie is stable; no eligible staff leaves client unassigned; system action cannot replace manual assignment.
- Direct assignment UPDATE without RPC rejected. Test all pre-existing staff workflows against the new restrictive read/update rules.
- Existing Add Client: employee assigns self and cannot submit another employee ID. Customer cannot use action. Check any direct INSERT paths separately against existing insertion policies.
- Browser: 360px mobile and desktop, keyboard/focus, empty states, pending buttons, interrupted requests, errors and refresh. Do not treat an unavailable response as an unsaved assignment: reload to verify.
- Auth sessions and customer profile retrieval still work. No cross-organisation or customer data leakage.

## Local checks executed

TypeScript noEmit; git diff whitespace checks; tests/assignment-suggestions.cjs covers availability/activity/capacity exclusions, workload order, stable ties, empty lists and immutable inputs. PostgreSQL migration was NOT executed against a database; real browser and end-to-end permission/concurrency tests remain outstanding.

## Rollback preparation

Before applying, save the existing database schema and deployment commit. Do not drop assignment-history data to undo a UI change. Coordinate rollback of code, trigger/functions and restrictive policies with the actual staging schema and other consumers. Do not relax production access rules to make a screen appear populated.
