export interface AstroFrontmatter extends Record<string, unknown> {
	excerpt?: string;
	minutes?: number;
	words?: number;
}

interface AstroData {
	frontmatter?: AstroFrontmatter;
}

export interface AstroRemarkFile {
	data: Record<string, unknown> & {
		astro?: AstroData;
	};
}

export function ensureAstroFrontmatter(
	file: AstroRemarkFile,
): AstroFrontmatter {
	if (!file.data.astro || typeof file.data.astro !== "object") {
		file.data.astro = {};
	}

	if (
		!file.data.astro.frontmatter ||
		typeof file.data.astro.frontmatter !== "object"
	) {
		file.data.astro.frontmatter = {};
	}

	return file.data.astro.frontmatter;
}
