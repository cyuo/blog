import fetch, { type RequestInit } from "node-fetch";
import type {
	StrapiAbout,
	StrapiBeian,
	StrapiCategory,
	StrapiConfig,
	StrapiFetchAllResult,
	StrapiFriend,
	StrapiLicenseConfig,
	StrapiNavConfig,
	StrapiPost,
	StrapiProfile,
	StrapiResponse,
	StrapiSiteConfig,
	StrapiTag,
} from "../types/strapi.ts";

/**
 * Strapi API Client
 * Handles all communication with Strapi CMS
 */
export class StrapiClient {
	private baseUrl: string;
	private token: string;
	private retries: number;
	private retryDelay: number;

	constructor(config: StrapiConfig) {
		// Ensure baseUrl ends with /
		this.baseUrl = config.url;
		if (!this.baseUrl.endsWith("/")) {
			this.baseUrl += "/";
		}
		this.token = config.token;
		this.retries = config.retries || 3;
		this.retryDelay = config.retryDelay || 1000;
	}

	/**
	 * Make authenticated request to Strapi API
	 */
	async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<StrapiResponse<T>> {
		// Remove leading slash from endpoint if present to avoid double slashes
		const cleanEndpoint = endpoint.startsWith("/")
			? endpoint.slice(1)
			: endpoint;
		const url = `${this.baseUrl}api/${cleanEndpoint}`;
		const headers = {
			Authorization: `Bearer ${this.token}`,
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		let lastError: Error | undefined;
		for (let attempt = 0; attempt < this.retries; attempt++) {
			try {
				const response = await fetch(url, { ...options, headers });

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				return (await response.json()) as StrapiResponse<T>;
			} catch (error) {
				lastError = error as Error;
				if (attempt < this.retries - 1) {
					await this.sleep(this.retryDelay * (attempt + 1));
				}
			}
		}

		throw new Error(
			`Failed after ${this.retries} attempts: ${lastError?.message}`,
		);
	}

	/**
	 * Fetch all posts with pagination
	 */
	async fetchPosts(): Promise<StrapiPost[]> {
		const posts: StrapiPost[] = [];
		let page = 1;
		const pageSize = 100;
		let hasMore = true;

		while (hasMore) {
			const params = new URLSearchParams({
				populate: "*",
				"pagination[page]": page.toString(),
				"pagination[pageSize]": pageSize.toString(),
				sort: "published:desc",
			});

			const response = await this.request<StrapiPost[]>(`/posts?${params}`);
			posts.push(...response.data);

			if (response.meta?.pagination) {
				hasMore =
					response.meta.pagination.page < response.meta.pagination.pageCount;
			} else {
				hasMore = false;
			}
			page++;
		}

		return posts;
	}

	/**
	 * Fetch all categories
	 */
	async fetchCategories(): Promise<StrapiCategory[]> {
		const params = new URLSearchParams({
			"pagination[pageSize]": "100",
		});
		const response = await this.request<StrapiCategory[]>(
			`/categories?${params}`,
		);
		return response.data;
	}

	/**
	 * Fetch all tags
	 */
	async fetchTags(): Promise<StrapiTag[]> {
		const params = new URLSearchParams({
			"pagination[pageSize]": "100",
		});
		const response = await this.request<StrapiTag[]>(`/tags?${params}`);
		return response.data;
	}

	/**
	 * Fetch friends list
	 */
	async fetchFriends(): Promise<StrapiFriend[]> {
		const params = new URLSearchParams({
			populate: "avatar",
			"pagination[pageSize]": "100",
		});
		const response = await this.request<StrapiFriend[]>(`/friends?${params}`);
		return response.data;
	}

	/**
	 * Fetch site configuration
	 */
	async fetchSiteConfig(): Promise<StrapiSiteConfig> {
		const response = await this.request<StrapiSiteConfig>(
			"/site-config?populate[favicon][populate]=src&populate[banner][populate]=src&populate[themeColor]=*&populate[toc]=*",
		);
		return response.data;
	}

	/**
	 * Fetch profile configuration
	 */
	async fetchProfile(): Promise<StrapiProfile> {
		const response = await this.request<StrapiProfile>("/profile?populate=*");
		return response.data;
	}

	/**
	 * Fetch navigation configuration
	 */
	async fetchNavConfig(): Promise<StrapiNavConfig> {
		const response = await this.request<StrapiNavConfig>(
			"/nav-config?populate=links",
		);
		return response.data;
	}

	/**
	 * Fetch about page content
	 */
	async fetchAbout(): Promise<StrapiAbout> {
		const response = await this.request<StrapiAbout>("/about");
		return response.data;
	}

	/**
	 * Fetch beian configuration
	 */
	async fetchBeian(): Promise<StrapiBeian> {
		const response = await this.request<StrapiBeian>("/beian?populate=*");
		return response.data;
	}

	/**
	 * Fetch license configuration
	 */
	async fetchLicenseConfig(): Promise<StrapiLicenseConfig> {
		const response = await this.request<StrapiLicenseConfig>("/license-config");
		return response.data;
	}

	/**
	 * Fetch all data needed for sync
	 */
	async fetchAll(): Promise<StrapiFetchAllResult> {
		const [
			posts,
			categories,
			tags,
			friends,
			siteConfig,
			profile,
			navConfig,
			about,
			beian,
			licenseConfig,
		] = await Promise.all([
			this.fetchPosts(),
			this.fetchCategories(),
			this.fetchTags(),
			this.fetchFriends(),
			this.fetchSiteConfig(),
			this.fetchProfile(),
			this.fetchNavConfig(),
			this.fetchAbout(),
			this.fetchBeian(),
			this.fetchLicenseConfig(),
		]);

		return {
			posts,
			categories,
			tags,
			friends,
			siteConfig,
			profile,
			navConfig,
			about,
			beian,
			licenseConfig,
			timestamp: new Date().toISOString(),
		};
	}

	sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
