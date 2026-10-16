const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
function compile(path, imports, globals = {}) {
  const out = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: out, require: name => { if (!(name in imports)) throw new Error(name); return imports[name] }, ...globals })
  return out
}
const input = compile('lib/jeevansutra/practitioner-input.ts', {}, { URL, Set, Error })
let verified = { id: 'user-1', email: 'test@example.com' }, allowed = true, saved = [], result = { ok: true }, body = {}
const env = { JS_PRACTITIONER_APPLICATIONS_ENABLED: 'true' }
const route = compile('app/api/website/practitioner-applications/route.ts', {
  '@/lib/jeevansutra/practitioner-input': input,
  '@/lib/jeevansutra/practitioner-server': { readBody: async () => body, rateLimit: async () => allowed, applicantIdentity: async () => verified, reply: (data, status = 200) => ({ data, status }) },
  '@/lib/jeevansutra/customer-server': { JS_ORGANIZATION_ID: 'fixed-org', database: async (path, init) => { if (!init) return { ok: true, json: async () => [{ id: 'application-1' }] }; saved.push(JSON.parse(init.body)); return result } },
}, { process: { env }, console: { error() {} }, Error })
const good = { fullName: 'Test', mobile: '+919999900000', email: 'test@example.com', city: 'Mumbai', state: 'MH', country: 'India', expertise: 'both', methods: 'Vedic', experience: 'starting', languages: 'Hindi', guidanceAreas: [], qualificationType: 'self_taught', qualificationDetails: 'Study', consultationMode: 'online', availability: 'flexible', introduction: 'Guidance', accuracyConsent: true, contactConsent: true }
;(async () => {
  env.JS_PRACTITIONER_APPLICATIONS_ENABLED = 'false'; assert.equal((await route.POST({})).status, 503); assert.equal(saved.length, 0)
  env.JS_PRACTITIONER_APPLICATIONS_ENABLED = 'true'; body = {}; assert.equal((await route.POST({})).status, 400); assert.equal(saved.length, 0)
  body = good; allowed = false; assert.equal((await route.POST({})).status, 429); assert.equal(saved.length, 0)
  allowed = true; verified = null; assert.equal((await route.POST({})).status, 401); assert.equal(saved.length, 0)
  verified = { id: 'user-1', email: 'wrong@example.com' }; assert.equal((await route.POST({})).status, 401); assert.equal(saved.length, 0)
  verified = { id: 'user-1', email: 'test@example.com' }; body = { ...good, organization_id: 'attacker', application_status: 'approved', employee_id: 'attacker' }
  assert.equal((await route.POST({})).status, 201); assert.equal(saved[0].organization_id, 'fixed-org'); assert.equal(saved[0].application_status, undefined); assert.equal(saved[0].employee_id, undefined); assert.equal(saved[0].auth_user_id, 'user-1')
  result = { ok: false, json: async () => ({ code: '23505' }) }; assert.equal((await route.POST({})).status, 201)
  result = { ok: false, json: async () => ({ code: '42P01' }) }; assert.equal((await route.POST({})).status, 503)
  console.log('PASS: closed launch gate, validation, rate-limit rejection, verified email/account binding, fixed organization, duplicate acknowledgement and database failure')
})().catch(error => { console.error(error); process.exitCode = 1 })
