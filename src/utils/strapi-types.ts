/**
 * Strapi API Types
 * Type definitions for Strapi CMS data structures
 */

export interface StrapiConfig {
	url: string;
	token: string;
	retries?: number;
	retryDelay?: number;
}

export interface StrapiPagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

export interface StrapiMeta {
	pagination: StrapiPagination;
}

export interface StrapiResponse<T> {
	data: T;
	meta?: StrapiMeta;
}

export interface StrapiImage {
	url: string;
	name?: string;
	alternativeText?: string;
	caption?: string;
	width?: number;
	height?: number;
}

export interface StrapiPost {
	id: number;
	attributes?: {
		title: string;
		slug: string;
		content: string;
		published: string;
		updated?: string;
		draft?: boolean;
		description?: string;
		image?: StrapiImage;
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
	};
	// Direct properties (when attributes are flattened)
	title?: string;
	slug?: string;
	content?: string;
	published?: string;
	updated?: string;
	draft?: boolean;
	description?: string;
	image?: StrapiImage;
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

export interface StrapiCategory {
	id: number;
	attributes?: {
		name?: string;
		slug?: string;
		categoryName?: string;
		categorySlug?: string;
	};
	name?: string;
	slug?: string;
	categoryName?: string;
	categorySlug?: string;
}

export interface StrapiTag {
	id: number;
	attributes?: {
		name?: string;
		slug?: string;
		tagName?: string;
		tagSlug?: string;
	};
	name?: string;
	slug?: string;
	tagName?: string;
	tagSlug?: string;
}

export interface StrapiFriend {
	id: number;
	attributes?: {
		name: string;
		url: string;
		avatar?: StrapiImage | string;
		description?: string;
	};
	name?: string;
	url?: string;
	avatar?: StrapiImage | string;
	description?: string;
}

export interface StrapiFavicon {
	src?: StrapiImage;
	theme?: string;
	sizes?: string;
}

export interface StrapiSiteConfig {
	id: number;
	attributes?: {
		title?: string;
		subtitle?: string;
		lang?: string;
		themeColor?: {
			hue?: number;
			fixed?: boolean;
		};
		banner?: {
			enable?: boolean;
			src?: StrapiImage;
			position?: string;
			creditEnable?: boolean;
			creditText?: string;
			creditUrl?: string;
		};
		toc?: {
			enable?: boolean;
			depth?: number;
		};
		favicon?: StrapiFavicon[];
	};
	// Direct properties
	title?: string;
	subtitle?: string;
	lang?: string;
	themeColor?: {
		hue?: number;
		fixed?: boolean;
	};
	banner?: {
		enable?: boolean;
		src?: StrapiImage;
		position?: string;
		creditEnable?: boolean;
		creditText?: string;
		creditUrl?: string;
	};
	toc?: {
		enable?: boolean;
		depth?: number;
	};
	favicon?: StrapiFavicon[];
}

export interface StrapiProfileLink {
	name: string;
	icon?: string;
	url: string;
}

export interface StrapiProfile {
	id: number;
	attributes?: {
		name?: string;
		bio?: string;
		avatar?: StrapiImage | string;
		links?: StrapiProfileLink[];
	};
	name?: string;
	bio?: string;
	avatar?: StrapiImage | string;
	links?: StrapiProfileLink[];
}

export interface StrapiNavLink {
	name: string;
	url: string;
	external?: boolean;
}

export interface StrapiNavConfig {
	id: number;
	attributes?: {
		links?: StrapiNavLink[];
	};
	links?: StrapiNavLink[];
}

export interface StrapiAbout {
	id: number;
	attributes?: {
		content?: string;
	};
	content?: string;
}

export interface StrapiBeian {
	id: number;
	attributes?: {
		icp?: {
			enable?: boolean;
			name?: string;
			url?: string;
		};
		mps?: {
			enable?: boolean;
			name?: string;
			url?: string;
		};
	};
	icp?: {
		enable?: boolean;
		name?: string;
		url?: string;
	};
	mps?: {
		enable?: boolean;
		name?: string;
		url?: string;
	};
}

export interface StrapiLicenseConfig {
	id: number;
	attributes?: {
		enable?: boolean;
		name?: string;
		url?: string;
	};
	enable?: boolean;
	name?: string;
	url?: string;
}

export interface StrapiFetchAllResult {
	posts: StrapiPost[];
	categories: StrapiCategory[];
	tags: StrapiTag[];
	friends: StrapiFriend[];
	siteConfig: StrapiSiteConfig;
	profile: StrapiProfile;
	navConfig: StrapiNavConfig;
	about: StrapiAbout;
	beian: StrapiBeian;
	licenseConfig: StrapiLicenseConfig;
	timestamp: string;
}
