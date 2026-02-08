import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StrapiFetchAllResult } from "../types/strapi.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export class ConfigUpdater {
	private configPath: string;

	constructor(configPath?: string) {
		this.configPath =
			configPath ||
			path.resolve(path.dirname(path.dirname(__dirname)), "src/config.ts");
	}

	escape(str: string): string {
		if (!str) return "";
		return str
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')
			.replace(/\n/g, "\\n");
	}

	async update(strapiData: StrapiFetchAllResult): Promise<void> {
		fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
		const config = this.generateConfig(strapiData);
		fs.writeFileSync(this.configPath, config, "utf-8");
	}

	generateConfig(strapiData: StrapiFetchAllResult): string {
		const siteConfig = strapiData.siteConfig || {};
		const profile = strapiData.profile || {};
		const navConfig = strapiData.navConfig || {};
		const beian = strapiData.beian || {};
		const licenseConfig = strapiData.licenseConfig || {};
		const friends = strapiData.friends || [];

		// Handle attributes if present
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
	title: "${this.escape(siteAttrs.title || "Fuwari")}",
	subtitle: "${this.escape(siteAttrs.subtitle || "Demo Site")}",
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
			text: "${this.escape(siteAttrs.banner?.creditText || "")}",
			url: "${siteAttrs.banner?.creditUrl || ""}",
		},
	},
	toc: {
		enable: ${siteAttrs.toc?.enable !== undefined ? siteAttrs.toc.enable : true},
		depth: ${siteAttrs.toc?.depth || 2},
	},
	favicon: [
${this.generateFavicons(siteAttrs.favicon || [])}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
${this.generateNavLinks(navAttrs.links || [])}
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "${this.getAvatarUrl(profileAttrs.avatar)}",
	name: "${this.escape(profileAttrs.name || "Fuwari")}",
	bio: "${this.escape(profileAttrs.bio || "")}",
	links: [
${this.generateProfileLinks(profileAttrs.links || [])}
	],
};

export const licenseConfig: LicenseConfig = {
	enable: ${licenseAttrs.enable !== undefined ? licenseAttrs.enable : true},
	name: "${this.escape(licenseAttrs.name || "CC BY-NC-SA 4.0")}",
	url: "${licenseAttrs.url || "https://creativecommons.org/licenses/by-nc-sa/4.0/"}",
};

export const beianConfig: BeianConfig = {
	icp: {
		enable: ${beianAttrs.icp?.enable !== undefined ? beianAttrs.icp.enable : false},
		name: "${this.escape(beianAttrs.icp?.name || "")}",
		url: "${beianAttrs.icp?.url || ""}",
	},
	mps: {
		enable: ${beianAttrs.mps?.enable !== undefined ? beianAttrs.mps.enable : false},
		name: "${this.escape(beianAttrs.mps?.name || "")}",
		url: "${beianAttrs.mps?.url || ""}",
	},
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const friends: Friend[] = [
${this.generateFriends(friends)}
];
`;
	}

	generateFavicons(favicons: FaviconData[]): string {
		if (!favicons || favicons.length === 0) {
			return "";
		}

		return favicons
			.map((favicon: FaviconData) => {
				const src = favicon.src?.url || "/favicon.ico";
				const theme = favicon.theme ? `\n\t\t\ttheme: "${favicon.theme}",` : "";
				const sizes = favicon.sizes ? `\n\t\t\tsizes: "${favicon.sizes}",` : "";

				return `\t\t{\n\t\t\tsrc: "${src}",${theme}${sizes}\n\t\t}`;
			})
			.join(",\n");
	}

	getAvatarUrl(avatar: AvatarData | string | undefined): string {
		if (!avatar) return "assets/img/avatar.png";

		if (typeof avatar === "object" && avatar.url) {
			return avatar.url || "assets/img/avatar.png";
		}
		if (typeof avatar === "string") {
			return avatar;
		}

		return "assets/img/avatar.png";
	}

	generateNavLinks(links: NavLinkData[]): string {
		if (!links || links.length === 0) {
			return "";
		}

		return links
			.map((link: NavLinkData) => {
				return `\t\t{\n\t\t\tname: "${this.escape(link.name)}",\n\t\t\turl: "${link.url}",\n\t\t\texternal: ${link.external || false},\n\t\t}`;
			})
			.join(",\n");
	}

	generateProfileLinks(links: ProfileLinkData[]): string {
		if (!links || links.length === 0) {
			return "";
		}

		return links
			.map((link: ProfileLinkData) => {
				return `\t\t{\n\t\t\tname: "${this.escape(link.name)}",\n\t\t\ticon: "${link.icon || "fa6-solid:link"}",\n\t\t\turl: "${link.url}",\n\t\t}`;
			})
			.join(",\n");
	}

	generateFriends(friends: FriendData[]): string {
		if (!friends || friends.length === 0) {
			return "";
		}

		return friends
			.map((friend: FriendData) => {
				const attrs = friend.attributes || friend;

				let avatarUrl = "";
				if (attrs.avatar) {
					if (typeof attrs.avatar === "object" && attrs.avatar.url) {
						avatarUrl = attrs.avatar.url;
					} else if (typeof attrs.avatar === "string") {
						avatarUrl = attrs.avatar;
					}
				}

				return `\t{\n\t\tname: "${this.escape(attrs.name || "")}",\n\t\turl: "${attrs.url || ""}",\n\t\tavatar: "${avatarUrl}",\n\t\tdescription: "${this.escape(attrs.description || "")}",\n\t}`;
			})
			.join(",\n");
	}
}
