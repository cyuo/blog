#!/usr/bin/env node

import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StrapiClient } from '../src/utils/strapi-client.ts';
import { MarkdownGenerator } from '../src/utils/markdown-generator.ts';
import { ConfigUpdater } from '../src/utils/config-updater.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(path.dirname(__dirname), '.env') });

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    verbose: args.includes('--verbose'),
  };
}

/**
 * Validate environment configuration
 */
function validateConfig() {
  const required = ['STRAPI_URL', 'STRAPI_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.log(chalk.yellow('⚠️  Missing Strapi environment variables, switching to testcase data.'));
    missing.forEach(key => console.log(chalk.yellow(`   - ${key}`)));
    return false;
  }

  return true;
}

/**
 * Clear posts directory
 */
function clearPostsDirectory(postsDir) {
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        fs.unlinkSync(path.join(postsDir, file));
      }
    }
  }
}

/**
 * Sync about page content to Astro content collection
 */
function syncAboutPage(aboutDir, aboutData) {
  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true });
  }

  const attrs = aboutData?.attributes || aboutData || {};
  const content = typeof attrs.content === 'string' ? attrs.content : '';
  const aboutPath = path.join(aboutDir, 'about.md');

  fs.writeFileSync(aboutPath, content, 'utf-8');
}

function copyTestcaseData() {
  const rootDir = path.resolve(path.dirname(__dirname));
  const testcaseDir = path.join(rootDir, 'testcase');
  const testcasePostsDir = path.join(testcaseDir, 'posts');
  const testcaseSpecDir = path.join(testcaseDir, 'spec');
  const testcaseConfigPath = path.join(testcaseDir, 'config.ts');

  if (!fs.existsSync(testcaseDir)) {
    throw new Error('Missing testcase directory');
  }
  if (!fs.existsSync(testcasePostsDir)) {
    throw new Error('Missing testcase/posts directory');
  }
  if (!fs.existsSync(testcaseSpecDir)) {
    throw new Error('Missing testcase/spec directory');
  }
  if (!fs.existsSync(testcaseConfigPath)) {
    throw new Error('Missing testcase/config.ts');
  }

  const targetPostsDir = path.join(rootDir, 'src/content/posts');
  const targetSpecDir = path.join(rootDir, 'src/content/spec');
  const targetConfigPath = path.join(rootDir, 'src/config/index.ts');

  fs.rmSync(targetPostsDir, { recursive: true, force: true });
  fs.rmSync(targetSpecDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetConfigPath), { recursive: true });

  fs.cpSync(testcasePostsDir, targetPostsDir, { recursive: true });
  fs.cpSync(testcaseSpecDir, targetSpecDir, { recursive: true });

  const testcaseConfig = fs.readFileSync(testcaseConfigPath, 'utf-8');
  const normalizedConfig = testcaseConfig.replace(
    'from "./types/config"',
    'from "../types/config"',
  );
  fs.writeFileSync(targetConfigPath, normalizedConfig, 'utf-8');
}

/**
 * Main sync function
 */
async function sync() {
  const options = parseArgs();
  const startTime = Date.now();

  console.log(chalk.cyan.bold('\n🚀 Strapi Sync Started\n'));

  // Validate configuration
  const canSync = validateConfig();
  if (!canSync) {
    const fallbackSpinner = ora('Using testcase data...').start();
    try {
      copyTestcaseData();
      fallbackSpinner.succeed(chalk.green('✓ Testcase data synced'));
    } catch (error) {
      fallbackSpinner.fail(chalk.red('✗ Failed to sync testcase data'));
      console.error(chalk.red(`   Error: ${error.message}`));
      process.exit(1);
    }
    return;
  }

  // Initialize components
  const strapiClient = new StrapiClient({
    url: process.env.STRAPI_URL,
    token: process.env.STRAPI_TOKEN,
  });
  const markdownGenerator = new MarkdownGenerator();
  const configUpdater = new ConfigUpdater();

  // Fetch data from Strapi
  const spinner = ora('Fetching data from Strapi...').start();

  let data;
  try {
    data = await strapiClient.fetchAll();
    spinner.succeed(chalk.green('✓ Data fetched from Strapi'));
  } catch (error) {
    spinner.fail(chalk.red('✗ Failed to fetch from Strapi'));
    console.error(chalk.red(`   Error: ${error.message}`));
    process.exit(1);
  }

  // Display data summary
  console.log(chalk.cyan('\n📊 Data Summary:'));
  console.log(chalk.gray(`   Posts: ${data.posts.length}`));
  console.log(chalk.gray(`   Categories: ${data.categories.length}`));
  console.log(chalk.gray(`   Tags: ${data.tags.length}`));
  console.log(chalk.gray(`   Friends: ${data.friends.length}`));

  // Clear and sync posts
  console.log(chalk.cyan('\n📝 Syncing Posts:\n'));

  const postsDir = path.resolve(path.dirname(__dirname), 'src/content/posts');

  // Ensure posts directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // Clear existing posts
  console.log(chalk.yellow('🗑️  Clearing existing posts...'));
  clearPostsDirectory(postsDir);

  let processedCount = 0;
  let errorCount = 0;

  for (const post of data.posts) {
    const attrs = post.attributes || post;
    const spinner = ora(`Processing: ${attrs.title}`).start();

    try {
      // Generate markdown (no image processing)
      const markdown = markdownGenerator.generate(attrs);
      const filename = markdownGenerator.generateFilename(attrs);
      const filePath = path.join(postsDir, filename);

      // Write file
      fs.writeFileSync(filePath, markdown, 'utf-8');

      spinner.succeed(chalk.green(`✓ ${attrs.title}`));
      if (options.verbose) {
        console.log(chalk.gray(`   → ${filename}`));
      }

      processedCount++;
    } catch (error) {
      spinner.fail(chalk.red(`✗ ${attrs.title}`));
      console.error(chalk.red(`   Error: ${error.message}`));
      errorCount++;
    }
  }

  console.log(chalk.cyan('\n📝 Posts Summary:'));
  console.log(chalk.green(`   ✓ Processed: ${processedCount}`));
  if (errorCount > 0) {
    console.log(chalk.red(`   ✗ Errors: ${errorCount}`));
  }

  // Sync about page
  console.log(chalk.cyan('\n📄 Syncing About Page:\n'));
  const aboutSpinner = ora('Writing src/content/spec/about.md...').start();
  try {
    const aboutDir = path.resolve(path.dirname(__dirname), 'src/content/spec');
    syncAboutPage(aboutDir, data.about);
    aboutSpinner.succeed(chalk.green('✓ About page synced'));
  } catch (error) {
    aboutSpinner.fail(chalk.red('✗ Failed to sync about page'));
    console.error(chalk.red(`   Error: ${error.message}`));
  }

  // Update config
  console.log(chalk.cyan('\n⚙️  Updating Configuration:\n'));

  const configSpinner = ora('Updating config/index.ts...').start();

  try {
    await configUpdater.update(data);
    configSpinner.succeed(chalk.green('✓ Configuration updated'));
  } catch (error) {
    configSpinner.fail(chalk.red('✗ Failed to update configuration'));
    console.error(chalk.red(`   Error: ${error.message}`));
  }

  // Generate taxonomy mapping file
  const taxonomySpinner = ora('Generating taxonomy mapping...').start();

  try {
    const taxonomyMap = {
      categories: {},
      tags: {}
    };

    // Build category mapping
    data.categories.forEach(cat => {
      const attrs = cat.attributes || cat;
      const slug = attrs.slug || attrs.name;
      taxonomyMap.categories[slug] = attrs.name;
    });

    // Build tag mapping
    data.tags.forEach(tag => {
      const attrs = tag.attributes || tag;
      const slug = attrs.slug || attrs.name;
      taxonomyMap.tags[slug] = attrs.name;
    });

    const taxonomyPath = path.resolve(path.dirname(__dirname), 'src/utils/taxonomy-map.json');
    fs.writeFileSync(taxonomyPath, JSON.stringify(taxonomyMap, null, 2), 'utf-8');

    taxonomySpinner.succeed(chalk.green('✓ Taxonomy mapping generated'));
  } catch (error) {
    taxonomySpinner.fail(chalk.red('✗ Failed to generate taxonomy mapping'));
    console.error(chalk.red(`   Error: ${error.message}`));
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(chalk.cyan.bold(`\n✨ Sync completed in ${duration}s\n`));
}

// Run sync
sync().catch(error => {
  console.error(chalk.red('\n❌ Sync failed:'));
  console.error(chalk.red(`   ${error.message}`));
  if (process.env.VERBOSE) {
    console.error(error.stack);
  }
  process.exit(1);
});
