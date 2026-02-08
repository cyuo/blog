import taxonomyMap from "./taxonomy-map.json";

/**
 * Get category name by slug
 */
export function getCategoryName(slug: string): string {
	return (taxonomyMap.categories as Record<string, string>)[slug] || slug;
}

/**
 * Get tag name by slug
 */
export function getTagName(slug: string): string {
	return (taxonomyMap.tags as Record<string, string>)[slug] || slug;
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
