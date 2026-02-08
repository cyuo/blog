import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { siteConfig } from "../config.ts";
import I18nKey from "../i18n/i18nKey.ts";
import { getTranslation, type Translation } from "../i18n/translation.ts";

interface PackageJsonData {
	name: string;
	version: string;
	packageManager?: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

interface LockFileVersionInfo {
	version?: string;
	[key: string]: unknown;
}

interface LockFileImporter {
	dependencies?: Record<string, LockFileVersionInfo>;
	devDependencies?: Record<string, LockFileVersionInfo>;
	[key: string]: unknown;
}

interface LockFileData {
	importers?: {
		"."?: LockFileImporter;
		[key: string]: LockFileImporter | undefined;
	};
	[key: string]: unknown;
}

interface GitInfo {
	hash: string;
	date: string;
}

interface GenerateVersionMarkdownOptions {
	mode?: string;
	lang?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const packageJsonPath = path.join(rootDir, "package.json");
const lockFilePath = path.join(rootDir, "pnpm-lock.yaml");
const outputPath = path.join(rootDir, "src/content/spec/version.md");

function toDateText(input: string): string {
	const date = new Date(input);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function getGitInfo(): GitInfo {
	try {
		const hash = execSync("git rev-parse --short=6 HEAD", {
			encoding: "utf-8",
			cwd: rootDir,
		}).trim();
		const timestamp = execSync("git log -1 --format=%ci HEAD", {
			encoding: "utf-8",
			cwd: rootDir,
		}).trim();
		return {
			hash,
			date: toDateText(timestamp),
		};
	} catch {
		return {
			hash: "",
			date: "",
		};
	}
}

function extractActualVersions(lockData: LockFileData): Record<string, string> {
	const actualVersions: Record<string, string> = {};
	const importer = lockData?.importers?.["."];

	if (importer?.dependencies) {
		for (const [name, info] of Object.entries(importer.dependencies)) {
			if (info?.version) {
				actualVersions[name] = info.version.split("(")[0].trim();
			}
		}
	}

	if (importer?.devDependencies) {
		for (const [name, info] of Object.entries(importer.devDependencies)) {
			if (info?.version) {
				actualVersions[name] = info.version.split("(")[0].trim();
			}
		}
	}

	return actualVersions;
}

function escapeCell(value: string): string {
	return value.replace(/\|/g, "\\|");
}

function toSortedEntries(
	deps: Record<string, string>,
	actualVersions: Record<string, string>,
): Array<[string, string]> {
	return Object.keys(deps)
		.map(
			(name) =>
				[name, actualVersions[name] || deps[name] || "unknown"] as [
					string,
					string,
				],
		)
		.sort(([a], [b]) => a.localeCompare(b));
}

function toTable(entries: Array<[string, string]>): string {
	if (entries.length === 0) {
		return "| `(none)` | - |";
	}

	return entries
		.map(
			([name, version]) =>
				`| \`${escapeCell(name)}\` | ${escapeCell(version)} |`,
		)
		.join("\n");
}

function toDisplayMode(mode: string, translation: Translation): string {
	switch (mode) {
		case "development":
			return translation[I18nKey.development];
		case "production":
			return translation[I18nKey.production];
		default:
			return mode;
	}
}

function buildMarkdown(
	packageJson: PackageJsonData,
	git: GitInfo,
	nodeVersion: string,
	mode: string,
	platform: string,
	arch: string,
	deps: Array<[string, string]>,
	devDeps: Array<[string, string]>,
	translation: Translation,
): string {
	const packageManager = packageJson.packageManager || "unknown";
	const appVersion =
		git.hash && git.date
			? `${packageJson.version} (${git.hash} ${git.date})`
			: packageJson.version;
	const title = translation[I18nKey.versionInfo];
	const displayMode = toDisplayMode(mode, translation);

	return `---
title: ${title}
---

# ${title}

本博客由 **[Hikari](https://zrn.net/)** 驱动，版权所有 © 2025 [Poi](https://zrn.net/)。

**[Hikari](https://zrn.net/)** 基于 **[Fuwari](https://github.com/saicaca/fuwari)** 二次开发。

**[Fuwari](https://github.com/saicaca/fuwari)** 基于 [MIT](https://github.com/saicaca/fuwari/blob/main/LICENSE) 协议开源。

\`\`\`text
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

## ${translation[I18nKey.application]}

| 字段 | 值 |
| --- | --- |
| ${translation[I18nKey.name]} | ${escapeCell(packageJson.name)} |
| ${translation[I18nKey.version]} | ${escapeCell(appVersion)} |
| ${translation[I18nKey.mode]} | ${escapeCell(displayMode)} |

## ${translation[I18nKey.runtimeEnvironment]}

| 字段 | 值 |
| --- | --- |
| ${translation[I18nKey.nodejs]} | ${escapeCell(nodeVersion)} |
| ${translation[I18nKey.packageManager]} | ${escapeCell(packageManager)} |
| ${translation[I18nKey.platform]} | ${escapeCell(platform)} |
| ${translation[I18nKey.architecture]} | ${escapeCell(arch)} |

## ${translation[I18nKey.dependencies]} (${deps.length})

| ${translation[I18nKey.package]} | ${translation[I18nKey.version]} |
| --- | --- |
${toTable(deps)}

## ${translation[I18nKey.devDependencies]} (${devDeps.length})

| ${translation[I18nKey.package]} | ${translation[I18nKey.version]} |
| --- | --- |
${toTable(devDeps)}
`;
}

export function resolveMode(input?: string): string | undefined {
	if (!input) {
		return undefined;
	}

	switch (input) {
		case "dev":
			return "development";
		case "build":
		case "preview":
		case "check":
		case "sync":
		case "pull":
			return "production";
		default:
			return input;
	}
}

function resolveLang(input?: string): string {
	return input || process.env.SITE_LANG || siteConfig.lang || "zh_CN";
}

export function generateVersionMarkdown(
	options: GenerateVersionMarkdownOptions = {},
): void {
	const packageJson = JSON.parse(
		readFileSync(packageJsonPath, "utf-8"),
	) as PackageJsonData;

	let lockData: LockFileData = {};
	if (existsSync(lockFilePath)) {
		lockData = load(readFileSync(lockFilePath, "utf-8")) as LockFileData;
	}

	const actualVersions = extractActualVersions(lockData);
	const dependencies = toSortedEntries(
		packageJson.dependencies || {},
		actualVersions,
	);
	const devDependencies = toSortedEntries(
		packageJson.devDependencies || {},
		actualVersions,
	);

	const mode =
		resolveMode(options.mode) ||
		resolveMode(process.env.VERSION_MODE) ||
		resolveMode(process.env.MODE) ||
		resolveMode(process.env.NODE_ENV) ||
		"unknown";
	const lang = resolveLang(options.lang);
	const translation = getTranslation(lang);

	const markdown = buildMarkdown(
		packageJson,
		getGitInfo(),
		process.version,
		mode,
		process.platform,
		process.arch,
		dependencies,
		devDependencies,
		translation,
	);

	mkdirSync(path.dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, markdown, "utf-8");
}
