import type {
	BeianConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Zirkeln",
	subtitle: "Yet another Fuwari blog site",
	lang: "zh_CN",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/image/banner.png",
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
			src: "/favicon.ico",
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
		{
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/image/avatar.webp",
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
		enable: true,
		name: "浙ICP备2025185594号-2",
		url: "https://beian.miit.gov.cn/",
	},
	mps: {
		enable: true,
		name: "浙公网安备33010602014005号",
		url: "https://beian.mps.gov.cn/#/query/webSearch?code=33010602014005",
	},
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
