#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { ConfigUpdater } from "../src/utils/config-updater.ts";
import { StrapiClient } from "../src/utils/strapi-client.ts";

async function main(): Promise<void> {
	const rootDir = process.cwd();
	dotenv.config({ path: path.join(rootDir, ".env") });

	const configPath = path.join(rootDir, "src/config.ts");
	const testcaseConfigPath = path.join(rootDir, "testcase/config.ts");
	const strapiUrl = process.env.STRAPI_URL;
	const strapiToken = process.env.STRAPI_TOKEN;

	if (!strapiUrl || !strapiToken) {
		if (fs.existsSync(testcaseConfigPath)) {
			fs.mkdirSync(path.dirname(configPath), { recursive: true });
			fs.copyFileSync(testcaseConfigPath, configPath);
			console.log("[bootstrap] config.ts generated from testcase/config.ts");
			return;
		}
		throw new Error("Missing STRAPI_URL/STRAPI_TOKEN and testcase/config.ts");
	}

	const strapiClient = new StrapiClient({
		url: strapiUrl,
		token: strapiToken,
	});
	const updater = new ConfigUpdater(configPath);
	const data = await strapiClient.fetchAll();
	await updater.update(data);
	console.log("[bootstrap] config.ts updated from Strapi");
}

void main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`[bootstrap] failed: ${message}`);
	process.exit(1);
});
