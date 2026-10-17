const ts = require('typescript');
const fs = require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname, '..'), cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 const m={exports:{}};cache.set(file,m);
 const source=fs.readFileSync(file,'utf8');
 const result=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true,fileName:file});
 const errors=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);assert.equal(errors.length,0,JSON.stringify(errors));
 new Function('require','module','exports',result.outputText)((name)=>{
  if(name==='server-only')return {};
  if(name.startsWith('@/'))return load(path.join(root,name.slice(2))+'.ts');
  if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name)+'.ts');
  return require(name);
 },m,m.exports);return m.exports;
}
const engine=load(root+'/lib/jeevansutra/compatibility-engine.ts');
const contract=load(root+'/lib/jeevansutra/compatibility-contract.ts');
const input={self:{name:'Akhand Singh Rathore',dob:'29/01/1986'},other:{name:'Shiny Dixit',dob:'05/12/1991'},kind:'Love & Marriage',relationship:'Partners',selfRole:'Partner',otherRole:'Partner',priorities:[]};
const f=engine.calculateCompatibility(input);
assert.deepEqual(f.combined,{1:6,2:3,3:0,4:0,5:2,6:1,7:0,8:1,9:5});
assert.equal(f.a.mulank.final,2);assert.equal(f.a.bhagyank.final,9);assert.equal(f.b.mulank.final,5);assert.equal(f.b.bhagyank.final,1);
assert.equal(f.a.nameNumber.compoundTotal,61);assert.equal(f.b.nameNumber.compoundTotal,30);
assert.equal(f.lines.find(x=>x.id==='silver_258').source,'together');
assert.equal(f.lines.find(x=>x.id==='column_951').source,'person_b');
assert.equal(f.lines.find(x=>x.id==='row_816').source,'person_a');
assert.equal(f.lines.find(x=>x.id==='golden_456').complete,false);
const project=load(root+'/lib/jeevansutra/compatibility-customer-result.ts').customerResult;
for(const kind of contract.compatibilityKinds){
 const out=engine.buildCompatibility({...input,kind,relationship:contract.relationships[kind][0]});
 assert.equal(out.standard.sections.length,5);assert.equal(out.practitioner.sections.length,6);
 assert.deepEqual(Object.keys(project({...out.standard,combined:f.combined,source:input,practitioner:out.practitioner})).sort(),['version','status','kind','relationship','roles','people','sections','limitation'].sort());
 assert.equal(JSON.stringify(out.standard).includes('mulank'),false);assert.equal(JSON.stringify(out.standard).includes('loShu'),false);
 const swapped=engine.calculateCompatibility({...input,self:input.other,other:input.self});assert.deepEqual(swapped.combined,f.combined);
}
assert.throws(()=>engine.calculateCompatibility({...input,other:{...input.other,dob:'31/02/1991'}}));
const old=load(root+'/lib/jeevansutra/compatibility-launch.ts').launchPreview;
const legacy=project(old('Personal Relationship Compatibility',input.self,{name:'Shiny Dixit',dob:''}));
assert.deepEqual(Object.keys(legacy.people[0]),['name']);assert.equal('action' in legacy,false);assert.equal('question' in legacy,false);
const release=load(root+'/lib/jeevansutra/compatibility-release.ts').compatibilityDraftEnabled;
process.env.JS_COMPATIBILITY_V2_DRAFT_ENABLED='true';process.env.VERCEL_ENV='production';assert.equal(release(),false);
process.env.VERCEL_ENV='preview';assert.equal(release(),true);delete process.env.JS_COMPATIBILITY_V2_DRAFT_ENABLED;assert.equal(release(),false);
assert.equal(contract.validRelationship('Family','Mother-in-law / daughter-in-law'),true);assert.equal(contract.validRelationship('Family','Partners'),false);
console.log('PASS: all source syntax, Akhand/Shiny arithmetic, eight lines, four categories, symmetry, invalid DOB, customer projection, legacy preservation, draft release gate.');
