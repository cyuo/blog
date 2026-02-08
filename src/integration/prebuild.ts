import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { runStrapiSync } from "../utils/strapi-sync.ts";
import {
	generateVersionMarkdown,
	resolveMode,
} from "../utils/version-markdown.ts";

const COMMANDS_REQUIRING_SYNC = new Set(["dev", "build"]);

interface PrebuildLogger {
	info: (message: string) => void;
}

function resolveRuntimeMode(input?: string): string {
	return (
		resolveMode(input) ||
		resolveMode(process.env.MODE) ||
		resolveMode(process.env.NODE_ENV) ||
		"unknown"
	);
}

function parseCliCommand(argv: string[] = process.argv.slice(2)): string {
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg.startsWith("--command=")) {
			return arg.slice("--command=".length);
		}
		if (arg === "--command") {
			return argv[i + 1] || "dev";
		}
	}
	return "dev";
}

export async function runPrebuild(
	commandInput?: string,
	logger?: PrebuildLogger,
): Promise<void> {
	const command = commandInput || "pull";
	const mode = resolveRuntimeMode(command);

	if (COMMANDS_REQUIRING_SYNC.has(command)) {
		logger?.info(`[prebuild] syncing content before ${command}`);
		await runStrapiSync({ mode });
		logger?.info(`[prebuild] sync completed with mode=${mode}`);
		return;
	}

	generateVersionMarkdown({ mode });
	logger?.info(`[prebuild] version markdown generated with mode=${mode}`);
}

export function prebuildIntegration(): AstroIntegration {
	return {
		name: "prebuild-generator",
		hooks: {
			"astro:config:setup": async ({ command, logger }) => {
				await runPrebuild(command, logger);
			},
		},
	};
}

async function main(): Promise<void> {
	const command = parseCliCommand();
	await runPrebuild(command, {
		info: (message: string) => {
			console.log(message);
		},
	});
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
	void main().catch((error: unknown) => {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`[prebuild] failed: ${message}`);
		process.exit(1);
	});
}
