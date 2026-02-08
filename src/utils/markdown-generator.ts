import TurndownService from "turndown";

interface PostData {
	title: string;
	slug?: string;
	content?: string;
	published: string;
	updated?: string;
	draft?: boolean;
	description?: string;
	image?: { url?: string } | string;
	tags?: Array<{
		attributes?: {
			slug?: string;
			name?: string;
			tagSlug?: string;
			tagName?: string;
		};
		slug?: string;
		name?: string;
		tagSlug?: string;
		tagName?: string;
	}>;
	category?: {
		attributes?: {
			slug?: string;
			name?: string;
			categorySlug?: string;
			categoryName?: string;
		};
		slug?: string;
		name?: string;
		categorySlug?: string;
		categoryName?: string;
	};
	lang?: string;
}

interface Frontmatter {
	title: string;
	published: string;
	draft: boolean;
	updated?: string;
	description?: string;
	image?: string;
	tags?: string[];
	category?: string;
	lang?: string;
}

/**
 * Markdown Generator
 * Converts Strapi content to markdown files with frontmatter
 */
export class MarkdownGenerator {
	private turndown: TurndownService;

	constructor() {
		this.turndown = new TurndownService({
			headingStyle: "atx",
			codeBlockStyle: "fenced",
			bulletListMarker: "-",
			emDelimiter: "*",
		});

		// Preserve special markdown features
		this.setupTurndownRules();
	}

	/**
	 * Setup custom Turndown rules
	 */
	setupTurndownRules(): void {
		// Preserve code blocks with language
		this.turndown.addRule("fencedCodeBlock", {
			filter: (node: HTMLElement) => {
				return (
					node.nodeName === "PRE" &&
					node.firstChild !== null &&
					(node.firstChild as HTMLElement).nodeName === "CODE"
				);
			},
			replacement: (_content: string, node: HTMLElement) => {
				const code = node.firstChild as HTMLElement;
				const language = code.className.replace("language-", "") || "";
				const codeContent = code.textContent || "";
				return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
			},
		});

		// Preserve math expressions
		this.turndown.addRule("mathBlock", {
			filter: (node: HTMLElement) => {
				return !!node.className && node.className.includes("math");
			},
			replacement: (content: string) => {
				return content;
			},
		});
	}

	/**
	 * Generate frontmatter from post data
	 */
	generateFrontmatter(post: PostData): Frontmatter {
		const frontmatter: Frontmatter = {
			title: post.title,
			published: this.formatDate(post.published),
			draft: post.draft || false,
		};

		if (post.updated) {
			frontmatter.updated = this.formatDate(post.updated);
		}

		if (post.description) {
			frontmatter.description = post.description;
		}

		if (post.image) {
			// Handle image object from Strapi
			if (typeof post.image === "object" && post.image.url) {
				frontmatter.image = post.image.url;
			} else if (typeof post.image === "string") {
				frontmatter.image = post.image;
			}
		}

		if (post.tags && post.tags.length > 0) {
			// Only save tag slugs
			frontmatter.tags = post.tags.map((tag) => {
				const tagData = tag.attributes || tag;
				return (
					tagData.slug ||
					tagData.tagSlug ||
					tagData.name ||
					tagData.tagName ||
					""
				);
			});
		}

		if (post.category) {
			// Only save category slug
			const catData = post.category.attributes || post.category;
			frontmatter.category =
				catData.slug ||
				catData.categorySlug ||
				catData.name ||
				catData.categoryName ||
				"";
		}

		if (post.lang) {
			frontmatter.lang = post.lang;
		}

		return frontmatter;
	}

	/**
	 * Format date for frontmatter
	 */
	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	}

	/**
	 * Convert frontmatter object to YAML string
	 */
	frontmatterToYaml(frontmatter: Frontmatter): string {
		const lines = ["---"];

		for (const [key, value] of Object.entries(frontmatter)) {
			if (value === undefined || value === null) continue;

			if (Array.isArray(value)) {
				lines.push(`${key}:`);
				value.forEach((item) => {
					lines.push(`  - "${this.escapeYaml(item)}"`);
				});
			} else if (typeof value === "string") {
				// Date fields should not be quoted
				if (key === "published" || key === "updated") {
					lines.push(`${key}: ${value}`);
				} else {
					lines.push(`${key}: "${this.escapeYaml(value)}"`);
				}
			} else if (typeof value === "boolean") {
				lines.push(`${key}: ${value}`);
			} else {
				lines.push(`${key}: ${value}`);
			}
		}

		lines.push("---");
		return lines.join("\n");
	}

	/**
	 * Escape YAML special characters
	 */
	escapeYaml(str: string): string {
		return str.replace(/"/g, '\\"');
	}

	/**
	 * Convert HTML content to markdown
	 */
	htmlToMarkdown(html: string): string {
		if (!html) return "";
		return this.turndown.turndown(html);
	}

	/**
	 * Generate markdown file content from post
	 */
	generate(post: PostData, imagePath: string | null = null): string {
		const frontmatter = this.generateFrontmatter(post);

		// Update image path if provided
		if (imagePath) {
			frontmatter.image = imagePath;
		}

		const yaml = this.frontmatterToYaml(frontmatter);

		// Get content - Strapi returns Markdown, keep it as-is
		const content = post.content || "";

		// Combine frontmatter and content
		return `${yaml}\n\n${content.trim()}\n`;
	}

	/**
	 * Generate filename from post
	 */
	generateFilename(post: PostData): string {
		// Use slug directly as filename
		let slug = post.slug;

		if (!slug) {
			// Fallback: create slug from title
			slug = post.title
				.toLowerCase()
				.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
				.replace(/^-+|-+$/g, "");
		}

		return `${slug}.md`;
	}
}
