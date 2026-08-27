#!/usr/bin/env node

/**
 * One-shot Storybook test-runner entry point.
 *
 * Builds Storybook (skip with SKIP_STORYBOOK_BUILD=1 when serving an existing
 * build), serves the static output on 127.0.0.1, waits for it to come up,
 * runs the test-runner against it, and always tears the server down.
 *
 * Set UPDATE_SNAPSHOTS=1 to regenerate the visual baselines deliberately.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(new URL('..', import.meta.url).pathname);
const PORT = process.env.STORYBOOK_PORT || '6006';
const BASE_URL = `http://127.0.0.1:${PORT}`;
const STATIC_DIR = join(ROOT, 'packages/react/storybook-static');

function run(command, args, extraEnv = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: ROOT,
			stdio: 'inherit',
			shell: process.platform === 'win32',
			env: { ...process.env, ...extraEnv },
		});
		child.on('exit', (code) =>
			code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)),
		);
		child.on('error', reject);
	});
}

async function waitForServer(url, timeoutMs = 60_000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`Storybook did not respond at ${url} within ${timeoutMs}ms`);
}

if (!process.env.SKIP_STORYBOOK_BUILD) {
	await run('pnpm', ['run', 'build-storybook']);
}

if (!existsSync(STATIC_DIR)) {
	throw new Error(`${STATIC_DIR} not found — run with the build step enabled.`);
}

const server = spawn(
	'pnpm',
	['exec', 'http-server', STATIC_DIR, '-p', PORT, '--silent', '--no-cache'],
	{ cwd: ROOT, stdio: 'ignore' },
);

let exitCode = 1;
try {
	await waitForServer(`${BASE_URL}/iframe.html`);
	await run('pnpm', [
		'--filter',
		'@kala-ui/react',
		'exec',
		'test-storybook',
		'--url',
		BASE_URL,
	]);
	exitCode = 0;
} finally {
	server.kill('SIGTERM');
}

process.exit(exitCode);
