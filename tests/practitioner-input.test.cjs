const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
const source = fs.readFileSync('lib/jeevansutra/practitioner-input.ts', 'utf8')
const exportsObject = {}
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: exportsObject, URL, Set, Error })
const parse = exportsObject.applicationInput
const good = { fullName: ' Test Practitioner ', mobile: '+91 99999 00000', email: ' TEST@example.com ', city: 'Mumbai', state: 'MH', country: 'India', expertise: 'both', methods: 'Vedic', experience: 'starting', languages: 'Hindi', guidanceAreas: ['Marriage Guidance', 'Marriage Guidance'], qualificationType: 'self_taught', qualificationDetails: 'Independent study', consultationMode: 'online', availability: 'flexible', introduction: 'Patient guidance', accuracyConsent: true, contactConsent: true, portfolioUrl: 'https://example.com' }
const parsed = parse(good)
assert.equal(parsed.email, 'test@example.com')
assert.equal(parsed.mobile, '+919999900000')
assert.equal(parsed.guidance_areas.length, 1)
assert.equal(parsed.full_name, 'Test Practitioner')
assert.equal('application_status' in parse({ ...good, application_status: 'approved', role: 'admin' }), false)
for (const change of [{ fullName: '' }, { expertise: 'admin' }, { experience: 'bad' }, { accuracyConsent: false }, { contactConsent: false }, { guidanceAreas: ['Unknown'] }, { guidanceAreas: 'Marriage Guidance' }, { introduction: 'x'.repeat(1501) }, { mobile: 'bad' }, { email: 'bad' }, { portfolioUrl: 'javascript:alert(1)' }, { portfolioUrl: 'https://user:pass@example.com' }]) assert.throws(() => parse({ ...good, ...change }))
console.log('PASS: normalization, consent, enums, lengths, URLs and privilege-field rejection')
