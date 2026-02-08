#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import dotenv from "dotenv";
import ora from "ora";
import I18nKey from "../i18n/i18nKey.ts";
import { getTranslation } from "../i18n/translation.ts";
import type {
	StrapiAbout,
	StrapiCategory,
	StrapiFetchAllResult,
	StrapiPost,
	StrapiTag,
} from "../types/strapi.ts";
import { ConfigUpdater } from "./config-updater.ts";
import { MarkdownGenerator } from "./markdown-generator.ts";
import { StrapiClient } from "./strapi-client.ts";
import { generateVersionMarkdown, resolveMode } from "./version-markdown.ts";

interface SyncOptions {
	verbose: boolean;
	mode?: string;
}

interface NormalizedPost {
	title: string;
	slug?: string;
	content?: string;
	published: string;
	updated?: string;
	draft?: boolean;
	description?: string;
	image?: { url?: string } | string;
	tags?: StrapiPost["tags"];
	category?: StrapiPost["category"];
	lang?: string;
}

interface TaxonomyMap {
	categories: Record<string, string>;
	tags: Record<string, string>;
}

interface TaxonomyLike {
	attributes?: {
		slug?: string;
		name?: string;
		categorySlug?: string;
		categoryName?: string;
		tagSlug?: string;
		tagName?: string;
	};
	slug?: string;
	name?: string;
	categorySlug?: string;
	categoryName?: string;
	tagSlug?: string;
	tagName?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(rootDir, ".env") });

function parseArgs(argv: string[] = process.argv.slice(2)): SyncOptions {
	let mode: string | undefined;
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg.startsWith("--mode=")) {
			mode = arg.slice("--mode=".length);
			break;
		}
		if (arg === "--mode") {
			mode = argv[i + 1];
			break;
		}
	}

	return {
		verbose: argv.includes("--verbose"),
		mode,
	};
}

function toErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function resolveRuntimeMode(input?: string): string {
	return (
		resolveMode(input) ||
		resolveMode(process.env.VERSION_MODE) ||
		resolveMode(process.env.MODE) ||
		resolveMode(process.env.NODE_ENV) ||
		"unknown"
	);
}

function validateConfig(): boolean {
	const required = ["STRAPI_URL", "STRAPI_TOKEN"];
	const missing = required.filter((key) => !process.env[key]);

	if (missing.length > 0) {
		console.log(
			chalk.yellow(
				"⚠️  Missing Strapi environment variables, switching to testcase data.",
			),
		);
		for (const key of missing) {
			console.log(chalk.yellow(`   - ${key}`));
		}
		return false;
	}

	return true;
}

function clearPostsDirectory(postsDir: string): void {
	if (!fs.existsSync(postsDir)) {
		return;
	}

	const files = fs.readdirSync(postsDir);
	for (const file of files) {
		if (file.endsWith(".md")) {
			fs.unlinkSync(path.join(postsDir, file));
		}
	}
}

function escapeYaml(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function stripLeadingH1(markdown: string): string {
	const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);

	while (lines.length > 0 && lines[0].trim() === "") {
		lines.shift();
	}

	if (lines.length > 0 && /^#\s+/.test(lines[0])) {
		lines.shift();
		while (lines.length > 0 && lines[0].trim() === "") {
			lines.shift();
		}
	}

	return lines.join("\n").trim();
}

function syncAboutPage(
	aboutDir: string,
	aboutData: StrapiAbout,
	lang: string,
): void {
	if (!fs.existsSync(aboutDir)) {
		fs.mkdirSync(aboutDir, { recursive: true });
	}

	const attrs = aboutData.attributes ?? aboutData;
	const content = typeof attrs.content === "string" ? attrs.content : "";
	const translation = getTranslation(lang);
	const title = translation[I18nKey.about];
	const body = stripLeadingH1(content);
	const markdown = `---\ntitle: "${escapeYaml(title)}"\n---\n\n# ${title}\n\n${body}\n`;
	const aboutPath = path.join(aboutDir, "about.md");
	fs.writeFileSync(aboutPath, markdown, "utf-8");
}

function syncFriendsPage(specDir: string, lang: string): void {
	if (!fs.existsSync(specDir)) {
		fs.mkdirSync(specDir, { recursive: true });
	}

	const translation = getTranslation(lang);
	const title = translation[I18nKey.friends];
	const markdown = `---\ntitle: "${escapeYaml(title)}"\n---\n\n# ${title}\n`;
	const friendsPath = path.join(specDir, "friends.md");
	fs.writeFileSync(friendsPath, markdown, "utf-8");
}

function copyTestcaseData(): void {
	const testcaseDir = path.join(rootDir, "testcase");
	const testcasePostsDir = path.join(testcaseDir, "posts");
	const testcaseSpecDir = path.join(testcaseDir, "spec");
	const testcaseConfigPath = path.join(testcaseDir, "config.ts");

	if (!fs.existsSync(testcaseDir)) {
		throw new Error("Missing testcase directory");
	}
	if (!fs.existsSync(testcasePostsDir)) {
		throw new Error("Missing testcase/posts directory");
	}
	if (!fs.existsSync(testcaseSpecDir)) {
		throw new Error("Missing testcase/spec directory");
	}
	if (!fs.existsSync(testcaseConfigPath)) {
		throw new Error("Missing testcase/config.ts");
	}

	const targetPostsDir = path.join(rootDir, "src/content/posts");
	const targetSpecDir = path.join(rootDir, "src/content/spec");
	const targetConfigPath = path.join(rootDir, "src/config.ts");

	fs.rmSync(targetPostsDir, { recursive: true, force: true });
	fs.rmSync(targetSpecDir, { recursive: true, force: true });
	fs.mkdirSync(path.dirname(targetConfigPath), { recursive: true });

	fs.cpSync(testcasePostsDir, targetPostsDir, { recursive: true });
	fs.cpSync(testcaseSpecDir, targetSpecDir, { recursive: true });

	const testcaseConfig = fs.readFileSync(testcaseConfigPath, "utf-8");
	fs.writeFileSync(targetConfigPath, testcaseConfig, "utf-8");
}

function normalizePost(post: StrapiPost): NormalizedPost | undefined {
	const attrs = post.attributes ?? post;

	if (!attrs.title || !attrs.published) {
		return undefined;
	}

	return {
		title: attrs.title,
		slug: attrs.slug,
		content: attrs.content,
		published: attrs.published,
		updated: attrs.updated,
		draft: attrs.draft,
		description: attrs.description,
		image: attrs.image,
		tags: attrs.tags,
		category: attrs.category,
		lang: attrs.lang,
	};
}

function extractTaxonomy(thing: TaxonomyLike): {
	slug?: string;
	name?: string;
} {
	const attrs = thing.attributes ?? thing;
	const slug = attrs.slug ?? attrs.categorySlug ?? attrs.tagSlug;
	const name = attrs.name ?? attrs.categoryName ?? attrs.tagName;
	return { slug, name };
}

function writeTaxonomyMap(
	categories: StrapiCategory[],
	tags: StrapiTag[],
): void {
	const taxonomyMap: TaxonomyMap = {
		categories: {},
		tags: {},
	};

	for (const category of categories) {
		const { slug, name } = extractTaxonomy(category);
		if (slug && name) {
			taxonomyMap.categories[slug] = name;
		}
	}

	for (const tag of tags) {
		const { slug, name } = extractTaxonomy(tag);
		if (slug && name) {
			taxonomyMap.tags[slug] = name;
		}
	}

	const taxonomyPath = path.join(rootDir, "src/utils/taxonomy-map.json");
	fs.writeFileSync(taxonomyPath, JSON.stringify(taxonomyMap, null, 2), "utf-8");
}

async function syncContent(options: SyncOptions): Promise<void> {
	const startTime = Date.now();
	const mode = resolveRuntimeMode(options.mode);

	console.log(chalk.cyan.bold("\n🚀 Strapi Sync Started\n"));

	const canSync = validateConfig();
	if (!canSync) {
		const fallbackSpinner = ora("Using testcase data...").start();
		try {
			copyTestcaseData();
			fallbackSpinner.succeed(chalk.green("✓ Testcase data synced"));
		} catch (error) {
			fallbackSpinner.fail(chalk.red("✗ Failed to sync testcase data"));
			throw new Error(toErrorMessage(error));
		}

		const versionSpinner = ora("Generating version markdown...").start();
		try {
			generateVersionMarkdown({ mode });
			versionSpinner.succeed(
				chalk.green(`✓ Version markdown generated (mode=${mode})`),
			);
		} catch (error) {
			versionSpinner.fail(chalk.red("✗ Failed to generate version markdown"));
			throw new Error(toErrorMessage(error));
		}

		const friendsSpinner = ora(
			"Writing src/content/spec/friends.md...",
		).start();
		try {
			const specDir = path.join(rootDir, "src/content/spec");
			syncFriendsPage(specDir, "zh_CN");
			friendsSpinner.succeed(chalk.green("✓ Friends page markdown synced"));
		} catch (error) {
			friendsSpinner.fail(chalk.red("✗ Failed to sync friends page markdown"));
			throw new Error(toErrorMessage(error));
		}
		return;
	}

	const strapiUrl = process.env.STRAPI_URL;
	const strapiToken = process.env.STRAPI_TOKEN;
	if (!strapiUrl || !strapiToken) {
		throw new Error("Missing STRAPI_URL or STRAPI_TOKEN");
	}

	const strapiClient = new StrapiClient({
		url: strapiUrl,
		token: strapiToken,
	});
	const markdownGenerator = new MarkdownGenerator();
	const configUpdater = new ConfigUpdater();

	const fetchSpinner = ora("Fetching data from Strapi...").start();
	let data: StrapiFetchAllResult;
	try {
		data = await strapiClient.fetchAll();
		fetchSpinner.succeed(chalk.green("✓ Data fetched from Strapi"));
	} catch (error) {
		fetchSpinner.fail(chalk.red("✗ Failed to fetch from Strapi"));
		throw new Error(toErrorMessage(error));
	}

	console.log(chalk.cyan("\n📊 Data Summary:"));
	console.log(chalk.gray(`   Posts: ${data.posts.length}`));
	console.log(chalk.gray(`   Categories: ${data.categories.length}`));
	console.log(chalk.gray(`   Tags: ${data.tags.length}`));
	console.log(chalk.gray(`   Friends: ${data.friends.length}`));

	console.log(chalk.cyan("\n📝 Syncing Posts:\n"));
	const postsDir = path.join(rootDir, "src/content/posts");

	if (!fs.existsSync(postsDir)) {
		fs.mkdirSync(postsDir, { recursive: true });
	}

	console.log(chalk.yellow("🗑️  Clearing existing posts..."));
	clearPostsDirectory(postsDir);

	let processedCount = 0;
	let errorCount = 0;

	for (const post of data.posts) {
		const normalized = normalizePost(post);
		if (!normalized) {
			errorCount++;
			console.error(
				chalk.red("   Error: post missing required title/published"),
			);
			continue;
		}

		const postSpinner = ora(`Processing: ${normalized.title}`).start();
		try {
			const markdown = markdownGenerator.generate(normalized);
			const filename = markdownGenerator.generateFilename(normalized);
			const filePath = path.join(postsDir, filename);
			fs.writeFileSync(filePath, markdown, "utf-8");

			postSpinner.succeed(chalk.green(`✓ ${normalized.title}`));
			if (options.verbose) {
				console.log(chalk.gray(`   → ${filename}`));
			}
			processedCount++;
		} catch (error) {
			postSpinner.fail(chalk.red(`✗ ${normalized.title}`));
			console.error(chalk.red(`   Error: ${toErrorMessage(error)}`));
			errorCount++;
		}
	}

	console.log(chalk.cyan("\n📝 Posts Summary:"));
	console.log(chalk.green(`   ✓ Processed: ${processedCount}`));
	if (errorCount > 0) {
		console.log(chalk.red(`   ✗ Errors: ${errorCount}`));
	}

	console.log(chalk.cyan("\n📄 Syncing About Page:\n"));
	const aboutSpinner = ora("Writing src/content/spec/about.md...").start();
	const specDir = path.join(rootDir, "src/content/spec");
	const lang =
		data.siteConfig.attributes?.lang ?? data.siteConfig.lang ?? "zh_CN";
	try {
		syncAboutPage(specDir, data.about, lang);
		aboutSpinner.succeed(chalk.green("✓ About page synced"));
	} catch (error) {
		aboutSpinner.fail(chalk.red("✗ Failed to sync about page"));
		console.error(chalk.red(`   Error: ${toErrorMessage(error)}`));
	}

	const friendsSpinner = ora("Writing src/content/spec/friends.md...").start();
	try {
		syncFriendsPage(specDir, lang);
		friendsSpinner.succeed(chalk.green("✓ Friends page markdown synced"));
	} catch (error) {
		friendsSpinner.fail(chalk.red("✗ Failed to sync friends page markdown"));
		console.error(chalk.red(`   Error: ${toErrorMessage(error)}`));
	}

	console.log(chalk.cyan("\n⚙️  Updating Configuration:\n"));
	const configSpinner = ora("Updating config.ts...").start();
	try {
		await configUpdater.update(data);
		configSpinner.succeed(chalk.green("✓ Configuration updated"));
	} catch (error) {
		configSpinner.fail(chalk.red("✗ Failed to update configuration"));
		console.error(chalk.red(`   Error: ${toErrorMessage(error)}`));
	}

	const taxonomySpinner = ora("Generating taxonomy mapping...").start();
	try {
		writeTaxonomyMap(data.categories, data.tags);
		taxonomySpinner.succeed(chalk.green("✓ Taxonomy mapping generated"));
	} catch (error) {
		taxonomySpinner.fail(chalk.red("✗ Failed to generate taxonomy mapping"));
		console.error(chalk.red(`   Error: ${toErrorMessage(error)}`));
	}

	const versionSpinner = ora("Generating version markdown...").start();
	try {
		generateVersionMarkdown({ mode, lang });
		versionSpinner.succeed(
			chalk.green(`✓ Version markdown generated (mode=${mode})`),
		);
	} catch (error) {
		versionSpinner.fail(chalk.red("✗ Failed to generate version markdown"));
		throw new Error(toErrorMessage(error));
	}

	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	console.log(chalk.cyan.bold(`\n✨ Sync completed in ${duration}s\n`));
}

export async function runStrapiSync(
	options: Partial<SyncOptions> = {},
): Promise<void> {
	const mergedOptions: SyncOptions = {
		verbose: options.verbose ?? false,
		mode: options.mode,
	};
	await syncContent(mergedOptions);
}

async function main(): Promise<void> {
	try {
		await runStrapiSync(parseArgs());
	} catch (error) {
		console.error(chalk.red("\n❌ Sync failed:"));
		console.error(chalk.red(`   ${toErrorMessage(error)}`));
		if (process.env.VERBOSE && error instanceof Error) {
			console.error(error.stack);
		}
		process.exit(1);
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
	void main();
}
