import type {
	BeianConfig,
	ExpressiveCodeConfig,
	Friend,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Hikari",
	subtitle: "Yet another Hikari blog site",
	lang: "zh_CN",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "https://i.zrn.net/pic/111024784_p0_bebcff40a6.png",
		position: "center",
		credit: {
			enable: false,
			text: "空色天絵 / NEO TOKYO NOIR 01",
			url: "https://www.pixiv.net/artworks/111024784",
		},
	},
	toc: {
		enable: true,
		depth: 3,
	},
	favicon: [
		{
			src: "https://i.zrn.net/pic/favicon_abf477e56d.ico",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		{
			name: "首页",
			url: "/",
			external: false,
		},
		{
			name: "归档",
			url: "/archive/",
			external: false,
		},
		{
			name: "友链",
			url: "/friends/",
			external: false,
		},
		{
			name: "关于",
			url: "/about/",
			external: false,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://i.zrn.net/pic/seia_avatar_15278c5941.webp",
	name: "Poi",
	bio: "Darkness cannot drive out darkness, only light can do that. Hate cannot drive out hate, only love can do that. - Martin Luther King, Jr.",
	links: [],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const beianConfig: BeianConfig = {
	icp: {
		enable: false,
		name: "",
		url: "",
	},
	mps: {
		enable: false,
		name: "",
		url: "",
	},
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const friends: Friend[] = [];
