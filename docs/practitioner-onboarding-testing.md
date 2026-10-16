# Practitioner applications: staging setup and tests

This patch is based on the uploaded admin-applications source. Existing client-testing work is paused; the Dashboard count mismatch remains unresolved.

## Setup order
1. Apply patch with git apply --check, then git apply. No commit or push is performed by the patch.
2. Base SQL migrations/20261016_practitioner_applications_base.sql mirrors the table/access policy already created manually in staging. On fresh environments apply it before the onboarding migration. Requires existing organizations, profiles, locations and Auth schema.
3. Apply migrations/20261016_practitioner_onboarding.sql, then migrations/20261016_practitioner_documents.sql, in this explicit order, to jeevan-sutra-staging only. Requires existing js_customer_access and practitioner_assignment_settings from earlier migrations. No existing client/customer/staff records are modified by setup.
4. Confirm Preview branch admin-applications has staging NEXT_PUBLIC_SUPABASE_URL, matching NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY. JS_RATE_LIMIT_HASH_SECRET must be at least 32 characters and scoped to the exact branch. Keep secrets private.
5. Add JS_PRACTITIONER_APPLICATIONS_ENABLED=true for Preview/admin-applications only. Unset/false closes submission.
6. In staging Supabase Authentication email templates, ensure the Magic Link template (and new-account confirmation template, if used by project settings) shows {{ .Token }} as the verification code. Keep email verification enabled and configure working SMTP delivery. This template change affects other OTP/magic-link flows in the SAME staging Auth project: preserve a confirmation link alongside the code if those flows require it. Test existing customer verification too. Review/approval itself does not send messages.
7. Typecheck and commit/push only intended files; wait for Preview Ready. Do not deploy to Production during staging testing.

## Behavior
- /website/join first requests name/email/mobile and sends an email OTP using Supabase Auth. After OTP validation, the server rejects existing customer/staff accounts before the UI sets a password. A verified eligible applicant chooses a password, completes the application, then may attach qualifications. Mobile is collected but not verified. The server and insert trigger independently enforce verified email/account binding.
- /website/join saves submitted applications privately. Server selects organization; public fields cannot approve applications or assign roles.
- /applications is for the existing active Jeevan Sutra organization admin, not either TSIA organization admin. Review notes required; optional work location must belong to Jeevan Sutra and be active.
- Approve issues a random private link, stored only as SHA-256 hash. Admin uses Copy onboarding link and shares it privately. Seven-day expiry; approving again replaces an unused link. No tokens are emailed or logged by review code.
- Link opens /website/practitioner-onboarding. Applicant uses the email already verified at application and the password chosen then to sign in and activate. The browser's temporary onboarding session does not replace employee cookies or customer local storage.
- DB independently checks confirmed Auth email matches application, approved state, expiry and unused invitation. Atomic activation updates the initial inactive/unassigned profile to role report_generator with specialization numerologist/astrologer/both, links application and appends audit history.
- New employee starts unavailable with capacity 20. Enable via Clients > Employees after onboarding. Work location is required for employee client creation. No practitioner access before activation.
- Existing customer-linked, active, organization-linked or elevated profiles cannot be converted automatically. Administrator must handle these cases separately; no silent role/organization replacement.
- One application per normalized email per organization. Repeated submissions acknowledge receipt without exposing or overwriting a stored application.

## Required staging checks
- New valid application -> one pending row; all fields match; form acknowledges only after save.
- Missing consent, invalid enums, oversized strings/requests, unsafe URLs -> rejected; no row saved.
- Retry same email -> one preserved row. Database/rate-limit/config failures -> visible error; form entries remain.
- Anonymous/customer/ordinary employee/TSIA admin cannot list or review JS applications.
- JS admin reads submitted details, records under_review/rejected/approved and notes. Inspect js_practitioner_review_history.
- Rejected/unapproved, expired, replaced and already used invitation cannot activate.
- Wrong or unconfirmed email cannot activate. Existing active staff/customer account remains unchanged.
- Happy path -> confirmed account becomes one active report_generator in JS org, correct specialization/location, unavailable assignment setting and application.employee_id. Sign into /login with that account.
- Two concurrent activation requests -> at most one activation/audit event; a lost success response may require admin checking employee_id before retry.
- Employee cannot review applications or see clients in another organization. Availability must be enabled deliberately.
- Test actual email delivery, Supabase redirect allowlist and mobile screens. No production tests authorized by this patch.

## Checks performed locally
TypeScript noEmit; git diff whitespace; pure input tests and mocked submission route tests. No live database, email, browser or concurrency test has run yet. SQL remains to be validated on staging. Rate-limit records contain HMAC keys only; periodically remove windows older than needed retention using an operational maintenance job.

## Documents and interview follow-up
- Private bucket js-practitioner-documents; no browser storage policies. Server authorizes every list/download/upload, comparing applicant Auth UID or checking active JS admin access. Downloads use signed URLs valid for 60 seconds; share no signed URLs publicly.
- Applicant uploads after submission while pending/under_review; admins can upload later, including after approval/onboarding. Types: degree, certificate, other qualification. PDF/JPEG/PNG only, max 5 MB each, 10 per application. Basic file signatures are checked; this is not antivirus scanning.
- Metadata records uploader ID/name, time, source (applicant/administrator), type and notes. Initial review state not_reviewed. Only JS admins can set verified or needs_clarification, with notes and audit history. Document upload never changes application approval or employee privileges.
- Admin can add telephone, in_person or other follow-up notes. The application shows recent review/interview events (up to 100 across the current page).
- Test cross-applicant list/download/upload denial, other-organization admin denial, forged file extension/MIME, oversize files, concurrent uploads near limit, rejected applicant upload denial and successful later admin attachment. Files cannot be replaced silently; each upload creates a new random path. No deletion UI in this release.
- Email code/template delivery, file storage and SQL functions are not verified against a live staging database yet. The SQL Editor base table success does not validate these later migrations.
