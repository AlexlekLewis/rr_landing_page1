// Offline source generation only. No environment, service or runtime access.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const [sourceRoot, compilerPath] = process.argv.slice(2);
if (!sourceRoot || !compilerPath) throw Error('Pass the reviewed Admin source root and TypeScript compiler module.');
const ts = createRequire(import.meta.url)(path.resolve(compilerPath));
const read = name => fs.readFileSync(path.join(sourceRoot, 'supabase/functions/_shared', name), 'utf8');
function pick(file, names) {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS), found = new Set();
  const selected = source.statements.filter(node => {
    const name = node.name?.text ?? (ts.isVariableStatement(node) && node.declarationList.declarations.length === 1 ? node.declarationList.declarations[0].name?.text : null);
    if (!names.includes(name)) return false; found.add(name); return true;
  });
  if (found.size !== names.length) throw Error('Reviewed pure projection source boundary changed.');
  return selected.map(node => node.getText(source)).join('\n');
}
const sources = {
  request: 'class PublicFailure extends Error {}\n' + pick('private-request-public.ts', ['uuid', 'token', 'fail', 'object', 'text', 'integer', 'choice', 'id', 'date', 'instant', 'priceProjection', 'requestProjection']),
  payment: pick('private-payment-recovery.ts', ['UUID', 'exact', 'paymentRecoveryProjection']),
  lapsed: read('private-lapsed-recovery.ts').replace("import {requestProjection} from './private-request-public.ts';", 'const {requestProjection} = requestCodec;'),
};
const exports = { request: ['requestProjection'], payment: ['paymentRecoveryProjection'], lapsed: ['isLapsedReview', 'lapsedQuoteProjection', 'lapsedReceiptProjection', 'lapsedCurrentProjection'] };
const hash = createHash('sha256').update(JSON.stringify(sources)).digest('hex');
let output = `// Generated pure wire projections. Run scripts/generate-recovery-model.mjs; do not edit.\n// Canonical source SHA256: ${hash}\n/* eslint-disable no-control-regex -- Reject literal controls in public provider URLs. */\n`;
for (const [name, source] of Object.entries(sources)) {
  const js = ts.transpileModule(source.replace(/export /g, ''), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  output += `const ${name}Codec = (() => {\n${js}\nreturn {${exports[name].join(',')}};\n})();\n`;
}
output += 'export const {paymentRecoveryProjection} = paymentCodec;\nexport const {isLapsedReview,lapsedQuoteProjection,lapsedReceiptProjection,lapsedCurrentProjection} = lapsedCodec;\n';
fs.mkdirSync(new URL('../src/components/booking/recovery/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../src/components/booking/recovery/recovery-model.js', import.meta.url), output);
