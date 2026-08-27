/**
 * One-shot codemod: add `data-kala-component="<kebab-name>"` to the rendered
 * root element(s) of every component in both UI packages.
 *
 * - Handles early returns, conditional/logical return expressions, and
 *   fragment roots (marks each direct element child).
 * - Does not descend into nested functions (render callbacks keep their
 *   parent's marker context; they render inside the component's root).
 * - Name = kebab-case of the function name, prefixed with the kebab-case
 *   directory name when not already a prefix (Content in dialog/ →
 *   "dialog-content"; CardHeader in card/ stays "card-header").
 * - Text-insertion only — run `biome format` on the touched files after.
 *
 * Uses @babel/parser from the pnpm store (repo pins typescript@7 native,
 * which ships no JS AST API).
 *
 * Usage: node scripts/add-kala-markers.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadBabelParser() {
	// Prefer a declared dependency if one ever appears; else use the pnpm store copy.
	for (const pkg of ["packages/react/package.json", "package.json"]) {
		try {
			const req = createRequire(path.join(repoRoot, pkg));
			return req("@babel/parser");
		} catch {}
	}
	const store = path.join(repoRoot, "node_modules/.pnpm");
	const candidates = fs
		.readdirSync(store)
		.filter((d) => d.startsWith("@babel+parser@"))
		.sort()
		.reverse();
	if (!candidates.length) throw new Error("@babel/parser not found in pnpm store");
	const req = createRequire(path.join(repoRoot, "package.json"));
	return req(path.join(store, candidates[0], "node_modules/@babel/parser"));
}

const parser = loadBabelParser();
const dry = process.argv.includes("--dry");
const roots = [
	path.join(repoRoot, "packages/react/src/components"),
	path.join(repoRoot, "packages/react-app/src/components"),
];
const SKIP = /(\.test\.tsx|\.stories\.tsx)$/;

const kebab = (s) =>
	s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

function walk(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else if (/\.tsx$/.test(entry.name) && !SKIP.test(entry.name)) out.push(full);
	}
	return out;
}

/** Collect JSX root elements from a return expression. */
function jsxRoots(node, acc) {
	while (node.type === "ParenthesizedExpression" || node.type === "TSAsExpression" || node.type === "TSNonNullExpression") {
		node = node.expression;
	}
	if (node.type === "JSXElement") {
		acc.push(node); // covers self-closing too (openingElement.selfClosing)
	} else if (node.type === "JSXFragment") {
		for (const child of node.children) {
			if (child.type === "JSXElement") acc.push(child);
		}
	} else if (node.type === "ConditionalExpression") {
		jsxRoots(node.consequent, acc);
		jsxRoots(node.alternate, acc);
	} else if (node.type === "LogicalExpression") {
		jsxRoots(node.right, acc);
	}
	return acc;
}

/** Visit a function body, collecting ReturnStatements without entering nested functions. */
function collectReturns(node, acc) {
	if (node.type === "ReturnStatement") acc.push(node);
	for (const key of Object.keys(node)) {
		// Babel attaches `loc`/`start`/`end`/`type` scalars; only recurse real child nodes.
		const child = node[key];
		const descend = (c) => {
			if (!c || typeof c.type !== "string") return;
			if (/^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassDeclaration|ClassExpression)$/.test(c.type)) return;
			collectReturns(c, acc);
		};
		if (Array.isArray(child)) child.forEach(descend);
		else descend(child);
	}
	return acc;
}

const summary = { files: 0, marked: 0, untouchedComponents: [] };

for (const file of walk(roots[0]).concat(walk(roots[1]))) {
	const source = fs.readFileSync(file, "utf8");
	const ast = parser.parse(source, {
		sourceType: "module",
		plugins: ["typescript", "jsx"],
		attachComment: false,
		ranges: false,
	});
	const dirName = kebab(path.basename(path.dirname(file)));
	const edits = [];

	for (const raw of ast.program.body) {
		let stmt = raw;
		if (stmt.type === "ExportNamedDeclaration" || stmt.type === "ExportDefaultDeclaration") {
			if (!stmt.declaration) continue; // `export { X }` re-exports — nothing to mark here
			stmt = stmt.declaration;
		}
		if (stmt.type !== "FunctionDeclaration" || !stmt.id) continue;
		const fnName = stmt.id.name;
		if (!/^[A-Z]/.test(fnName)) continue; // hooks/helpers
		let marker = kebab(fnName);
		if (marker !== dirName && !marker.startsWith(`${dirName}-`)) marker = `${dirName}-${marker}`;

		let marked = 0;
		if (!stmt.body) { summary.untouchedComponents.push(`${path.relative(repoRoot, file)} :: ${fnName}`); continue; }
		for (const ret of collectReturns(stmt.body, [])) {
			if (!ret.argument) continue;
			for (const el of jsxRoots(ret.argument, [])) {
				const opening = el.type === "JSXElement" ? el.openingElement : el;
				const has = opening.attributes.some(
					(p) => p.type === "JSXAttribute" && p.name.name === "data-kala-component",
				);
				if (has) { marked++; continue; }
				const pos = opening.name.end;
				edits.push({ pos, text: ` data-kala-component="${marker}"` });
				marked++;
				summary.marked++;
			}
		}
		if (marked === 0) summary.untouchedComponents.push(`${path.relative(repoRoot, file)} :: ${fnName}`);
	}

	if (edits.length) {
		summary.files++;
		if (!dry) {
			edits.sort((a, b) => b.pos - a.pos);
			let out = source;
			for (const e of edits) out = out.slice(0, e.pos) + e.text + out.slice(e.pos);
			fs.writeFileSync(file, out);
		}
	}
}

console.log(`${dry ? "[dry] " : ""}files changed: ${summary.files}, attributes inserted: ${summary.marked}`);
if (summary.untouchedComponents.length) {
	console.log("components with no JSX return (verify: providers/logic-only expected):");
	for (const c of summary.untouchedComponents) console.log(`  - ${c}`);
}
