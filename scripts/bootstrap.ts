#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import type { StrapiFetchAllResult } from "../src/types/strapi.ts";
import { StrapiClient } from "../src/utils/strapi-client.ts";

interface FaviconData {
	src?: { url?: string };
	theme?: string;
	sizes?: string;
}

interface AvatarData {
	url?: string;
}

interface NavLinkData {
	name: string;
	url: string;
	external?: boolean;
}

interface ProfileLinkData {
	name: string;
	icon?: string;
	url: string;
}

interface FriendData {
	attributes?: {
		name: string;
		url: string;
		avatar?: AvatarData | string;
		description?: string;
	};
	name?: string;
	url?: string;
	avatar?: AvatarData | string;
	description?: string;
}

function escapeValue(str: string): string {
	if (!str) return "";
	return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function generateFavicons(favicons: FaviconData[]): string {
	if (!favicons || favicons.length === 0) return "";
	return favicons
		.map((favicon) => {
			const src = favicon.src?.url || "/favicon.ico";
			const theme = favicon.theme ? `\n\t\t\ttheme: "${favicon.theme}",` : "";
			const sizes = favicon.sizes ? `\n\t\t\tsizes: "${favicon.sizes}",` : "";
			return `\t\t{\n\t\t\tsrc: "${src}",${theme}${sizes}\n\t\t}`;
		})
		.join(",\n");
}

function getAvatarUrl(avatar: AvatarData | string | undefined): string {
	if (!avatar) return "assets/img/avatar.png";
	if (typeof avatar === "object" && avatar.url) return avatar.url;
	if (typeof avatar === "string") return avatar;
	return "assets/img/avatar.png";
}

function generateNavLinks(links: NavLinkData[]): string {
	if (!links || links.length === 0) return "";
	return links
		.map((link) => {
			return `\t\t{\n\t\t\tname: "${escapeValue(link.name)}",\n\t\t\turl: "${link.url}",\n\t\t\texternal: ${link.external || false},\n\t\t}`;
		})
		.join(",\n");
}

function generateProfileLinks(links: ProfileLinkData[]): string {
	if (!links || links.length === 0) return "";
	return links
		.map((link) => {
			return `\t\t{\n\t\t\tname: "${escapeValue(link.name)}",\n\t\t\ticon: "${link.icon || "fa6-solid:link"}",\n\t\t\turl: "${link.url}",\n\t\t}`;
		})
		.join(",\n");
}

function generateFriends(friends: FriendData[]): string {
	if (!friends || friends.length === 0) return "";
	return friends
		.map((friend) => {
			const attrs = friend.attributes || friend;
			let avatarUrl = "";
			if (attrs.avatar) {
				if (typeof attrs.avatar === "object" && attrs.avatar.url) {
					avatarUrl = attrs.avatar.url;
				} else if (typeof attrs.avatar === "string") {
					avatarUrl = attrs.avatar;
				}
			}
			return `\t{\n\t\tname: "${escapeValue(attrs.name || "")}",\n\t\turl: "${attrs.url || ""}",\n\t\tavatar: "${avatarUrl}",\n\t\tdescription: "${escapeValue(attrs.description || "")}",\n\t}`;
		})
		.join(",\n");
}

function generateConfig(strapiData: StrapiFetchAllResult): string {
	const siteConfig = strapiData.siteConfig || {};
	const profile = strapiData.profile || {};
	const navConfig = strapiData.navConfig || {};
	const beian = strapiData.beian || {};
	const licenseConfig = strapiData.licenseConfig || {};
	const friends = strapiData.friends || [];

	const siteAttrs = siteConfig.attributes || siteConfig;
	const profileAttrs = profile.attributes || profile;
	const navAttrs = navConfig.attributes || navConfig;
	const beianAttrs = beian.attributes || beian;
	const licenseAttrs = licenseConfig.attributes || licenseConfig;

	return `import type {
	BeianConfig,
	ExpressiveCodeConfig,
	Friend,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "${escapeValue(siteAttrs.title || "Fuwari")}",
	subtitle: "${escapeValue(siteAttrs.subtitle || "Demo Site")}",
	lang: "${siteAttrs.lang || "en"}",
	themeColor: {
		hue: ${siteAttrs.themeColor?.hue || 250},
		fixed: ${siteAttrs.themeColor?.fixed || false},
	},
	banner: {
		enable: ${siteAttrs.banner?.enable !== undefined ? siteAttrs.banner.enable : true},
		src: "${siteAttrs.banner?.src?.url || "assets/img/banner.png"}",
		position: "${siteAttrs.banner?.position || "center"}",
		credit: {
			enable: ${siteAttrs.banner?.creditEnable !== undefined ? siteAttrs.banner.creditEnable : false},
			text: "${escapeValue(siteAttrs.banner?.creditText || "")}",
			url: "${siteAttrs.banner?.creditUrl || ""}",
		},
	},
	toc: {
		enable: ${siteAttrs.toc?.enable !== undefined ? siteAttrs.toc.enable : true},
		depth: ${siteAttrs.toc?.depth || 2},
	},
	favicon: [
${generateFavicons(siteAttrs.favicon || [])}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
${generateNavLinks(navAttrs.links || [])}
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "${getAvatarUrl(profileAttrs.avatar)}",
	name: "${escapeValue(profileAttrs.name || "Fuwari")}",
	bio: "${escapeValue(profileAttrs.bio || "")}",
	links: [
${generateProfileLinks(profileAttrs.links || [])}
	],
};

export const licenseConfig: LicenseConfig = {
	enable: ${licenseAttrs.enable !== undefined ? licenseAttrs.enable : true},
	name: "${escapeValue(licenseAttrs.name || "CC BY-NC-SA 4.0")}",
	url: "${licenseAttrs.url || "https://creativecommons.org/licenses/by-nc-sa/4.0/"}",
};

export const beianConfig: BeianConfig = {
	icp: {
		enable: ${beianAttrs.icp?.enable !== undefined ? beianAttrs.icp.enable : false},
		name: "${escapeValue(beianAttrs.icp?.name || "")}",
		url: "${beianAttrs.icp?.url || ""}",
	},
	mps: {
		enable: ${beianAttrs.mps?.enable !== undefined ? beianAttrs.mps.enable : false},
		name: "${escapeValue(beianAttrs.mps?.name || "")}",
		url: "${beianAttrs.mps?.url || ""}",
	},
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const friends: Friend[] = [
${generateFriends(friends)}
];
`;
}

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
	const data = await strapiClient.fetchAll();
	fs.mkdirSync(path.dirname(configPath), { recursive: true });
	fs.writeFileSync(configPath, generateConfig(data), "utf-8");
	console.log("[bootstrap] config.ts updated from Strapi");
}

void main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`[bootstrap] failed: ${message}`);
	process.exit(1);
});
