# Standing development rules

Read this file before starting work. These rules apply throughout this repository.

## Working method
- Use simple English. Guide the user through one action at a time, provide complete single-line Termux commands, and wait for the result.
- Before changes, verify the repository, folder, branch, pending changes, target project, environment and database.
- Distinguish planned, changed, tested, committed, deployed and verified-live work. Never claim success without evidence.

## Live and development separation
- Develop on feature branches and review exact preview deployments by project, branch and commit before release.
- Keep separate development and production-review checkouts, browser sessions and clearly named bookmarks.
- Verify separate Supabase projects and matching credentials for development and production. Preview does not prove database isolation.
- Until database isolation is verified, pause preview registration, save and other mutation tests; continue safe read-only work.
- Keep Jeevan Sutra, TSIA and Redsoft data, credentials and scope separate. Do not change another product as a side effect.
- Scope experimental environment variables to the intended Preview branch. Verify project, environment and branch before changing settings.

## Data and credentials
- Preserve existing customer records and unrelated local files. Never delete, reset, merge or move records for testing.
- Use labelled test accounts and synthetic test data in development.
- Keep secrets out of chat, screenshots, logs, Git and public client variables. Server secrets must never use NEXT_PUBLIC_ names.
- Keep access controls enabled. Verify customer ownership, roles and storage permissions.
- Add only necessary exact authentication callback URLs. Preserve live Site URL and existing required callbacks.
- Use test payment modes and test recipients. Prevent accidental customer messages or charges.

## Changes and releases
- Record database changes as versioned migrations; review against the actual target database before applying.
- Verify usable backups and recovery arrangements before significant live or database changes. Git does not back up customer data.
- Review diffs and stage only intended files. Do not use broad staging when unrelated files are present.
- Test relevant functionality, mobile layout, authentication, save and reopen, allowances and access permissions before release.
- Do not run load tests against live without an explicitly planned scope.
- Prepare a concrete reviewed release and rollback plan before requesting live-release approval. Existing explicit authorization remains valid.
- Do not merge, promote or deploy to production as part of preview testing.
- Record the previous working deployment; code rollback does not undo database changes.
- Review destructive commands, force pushes, hard resets and deletion individually; require explicit authorization for destructive actions.

## Android operation
- Keep the phone, browsers and Termux packages updated; use a strong screen lock and two-factor authentication.
- Keep recovery codes safely outside the phone. Do not run unknown APKs or unreviewed downloaded scripts.
- Release with sufficient battery, a stable connection and time for immediate post-release checks.

## Enforcement
- Apply these rules in future sessions. If required facts are missing, verify them before the dependent action.
- This document guides work; it does not technically enforce branch protection, database isolation or backups.
