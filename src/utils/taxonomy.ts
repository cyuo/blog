import taxonomyMap from "../assets/meta/taxonomy-map.json";

function resolveTaxonomyName(
	map: Record<string, string>,
	slug: string,
): string {
	const normalizedSlug = (slug || "").trim();
	if (!normalizedSlug) {
		return slug;
	}

	if (map[normalizedSlug]) {
		return map[normalizedSlug];
	}

	try {
		const decodedSlug = decodeURIComponent(normalizedSlug);
		if (decodedSlug !== normalizedSlug && map[decodedSlug]) {
			return map[decodedSlug];
		}
	} catch {
		// Keep fallback behavior when slug is not URI-encoded
	}

	return slug;
}

/**
 * Get category name by slug
 */
export function getCategoryName(slug: string): string {
	return resolveTaxonomyName(
		taxonomyMap.categories as Record<string, string>,
		slug,
	);
}

/**
 * Get tag name by slug
 */
export function getTagName(slug: string): string {
	return resolveTaxonomyName(taxonomyMap.tags as Record<string, string>, slug);
}

/**
 * Get all categories
 */
export function getAllCategories(): Record<string, string> {
	return taxonomyMap.categories;
}

/**
 * Get all tags
 */
export function getAllTags(): Record<string, string> {
	return taxonomyMap.tags;
}
