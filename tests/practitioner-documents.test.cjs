const assert = require('node:assert/strict')
const fs = require('node:fs'); const ts = require('typescript'); const vm = require('node:vm')
const out = {}
let bearer = null, admin = false
const application = { id: '11111111-1111-4111-8111-111111111111', auth_user_id: 'applicant-1', application_status: 'pending' }
const imports = {
  'server-only': {},
  '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'admin-1' } } }) }, rpc: async () => ({ data: admin, error: null }) }) },
  './customer-server': { JS_ORGANIZATION_ID: 'js', database: async () => ({ ok: true, json: async () => [application] }) },
  './practitioner-server': { applicantIdentity: async () => bearer },
}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/jeevansutra/practitioner-documents-server.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: out, require: name => { if (!(name in imports)) throw Error(name); return imports[name] }, Uint8Array, String, Error })
const format = out.documentFormat
assert.equal(format(new Uint8Array(Buffer.from('%PDF-1.7'))).extension, 'pdf')
assert.equal(format(new Uint8Array([137,80,78,71,13,10,26,10])).extension, 'png')
assert.equal(format(new Uint8Array([255,216,255])).extension, 'jpg')
assert.equal(format(new Uint8Array(Buffer.from('<script>bad</script>'))), null)
assert.equal(format(new Uint8Array(Buffer.from('MZ fake.pdf'))), null)
assert.equal(format(new Uint8Array()), null)
const req = has => ({ headers: { has: () => has } })
;(async () => {
  assert.equal(await out.documentAccess(req(true), application.id), null)
  bearer = { id: 'other-applicant' }; assert.equal(await out.documentAccess(req(true), application.id), null)
  bearer = { id: 'applicant-1' }; assert.equal((await out.documentAccess(req(true), application.id)).admin, false)
  assert.equal(await out.documentAccess(req(false), application.id), null)
  admin = true; assert.equal((await out.documentAccess(req(false), application.id)).admin, true)
  assert.equal(await out.documentAccess(req(false), 'bad-id'), null)
  console.log('PASS: supported file signatures, forged file rejection and applicant/admin document authorization')
})().catch(error => { console.error(error); process.exitCode = 1 })
