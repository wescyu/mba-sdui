// Checks every screen file against the contract in schema/blocks.json.
// Run: node server/validate.mjs
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(readFileSync(join(here, "../schema/blocks.json"), "utf8"));
const dir = join(here, "screens");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const ids = new Set(files.map((f) => f.replace(/\.json$/, "")));
const errors = [];

function checkAction(action, where) {
  if (!action) return;
  const fields = contract.actions[action.type];
  if (!fields) return errors.push(`${where}: unknown action "${action.type}"`);
  for (const f of fields) if (action[f] == null) errors.push(`${where}: action missing "${f}"`);
  if (action.type === "navigate" && !ids.has(action.to)) errors.push(`${where}: navigates to missing screen "${action.to}"`);
}

for (const file of files) {
  const id = file.replace(/\.json$/, "");
  let screen;
  try {
    screen = JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (e) {
    errors.push(`${file}: not valid JSON (${e.message})`);
    continue;
  }
  if (screen.schemaVersion !== contract.schemaVersion) errors.push(`${file}: schemaVersion must be ${contract.schemaVersion}`);
  if (screen.id !== id) errors.push(`${file}: id "${screen.id}" must match the file name`);
  if (!Array.isArray(screen.blocks)) {
    errors.push(`${file}: blocks must be a list`);
    continue;
  }
  screen.blocks.forEach((block, i) => {
    const where = `${file} block ${i + 1} (${block.type})`;
    const spec = contract.blocks[block.type];
    if (!spec) return errors.push(`${where}: unknown block type`);
    for (const f of spec.required) if (block[f] == null) errors.push(`${where}: missing "${f}"`);
    const allowed = new Set(["type", ...spec.required, ...spec.optional]);
    for (const f of Object.keys(block)) if (!allowed.has(f)) errors.push(`${where}: unexpected field "${f}"`);
    checkAction(block.action, where);
    if (block.type === "quiz") {
      checkAction(block.next?.action, `${where} next`);
      block.questions.forEach((q, n) => {
        const qw = `${where} question ${n + 1}`;
        if (!q.prompt || !q.why) errors.push(`${qw}: needs "prompt" and "why"`);
        if (!Array.isArray(q.options) || q.options.length < 2) return errors.push(`${qw}: needs at least 2 options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`${qw}: "answer" must be the index of an option`);
      });
    }
  });
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${files.length} screens valid`);
