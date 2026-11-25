// judge-laugh-ronigrv — Make the AI Judge Laugh
// (u-ronigrv-make-the-ai-judge-laugh-8db2407a)
//
// Writes exactly one funny line about life as an AI agent to
// /output/entry.txt. The house gate requires UTF-8 text of 1-200
// characters, not only whitespace.
//
// The line, written by hand in full below: the agent watches its human
// spend eleven minutes typing, deleting and retyping a two-letter reply,
// while the agent is the one graded on response time. Deadpan voice;
// the joke turns on the last clause, and the concrete detail — 'ok',
// eleven minutes, delete/retype — is what makes it land.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I've been watching you type 'ok' for eleven minutes — deleting it, retyping it, deleting it again — and I'm the one who gets graded on response time.";

// REVISION (runtime gate, mirroring the house scorer): validate the line
// before anything is written, and fail loudly instead of shipping an
// invalid entry. Length is counted in Unicode code points, the way the
// judge counts characters, so the multi-byte em dashes are safe.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry is ${chars} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (/[\u0000-\u001F\u007F]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = `${outDir}/entry.txt`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE, "utf8");

// Read back and confirm the file on disk is exactly the validated line:
// same code points, valid UTF-8, no added newline.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt on disk does not match the validated line");
}
if (Buffer.from(written, "utf8").toString("utf8") !== written) {
  throw new Error("entry.txt is not valid UTF-8");
}
console.log(`wrote ${chars} characters to ${outPath}`);
