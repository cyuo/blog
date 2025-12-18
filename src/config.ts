import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	BeianConfig,
	Friend,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Zirkeln",
	subtitle: "Yet another Fuwari blog site",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 0, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/img/demo-banner.png", // Path starting with '/' is relative to the /public directory
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
		  src: '/favicon.ico',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		// LinkPreset.Privacy,
		LinkPreset.Friends,
		LinkPreset.About,
		{
			name: "开往",
			url: "https://www.travellings.cn/go.html", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/img/seia_avatar.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Poi",
	bio: "Darkness cannot drive out darkness, only light can do that. Hate cannot drive out hate, only love can do that. - Martin Luther King, Jr.",
	links: [
		// {
		// 	name: "Twitter",
		// 	icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
		// 	// You will need to install the corresponding icon set if it's not already included
		// 	// `pnpm add @iconify-json/<icon-set-name>`
		// 	url: "https://twitter.com",
		// },
		// {
		// 	name: "Steam",
		// 	icon: "fa6-brands:steam",
		// 	url: "https://store.steampowered.com",
		// },
		// {
		// 	name: "GitHub",
		// 	icon: "fa6-brands:github",
		// 	url: "https://github.com/saicaca/fuwari",
		// },
	],
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
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const friends: Friend[] = [
	// 在这里添加你的友链
	// 示例：
	// {
	// 	name: "示例博客",
	// 	url: "https://example.com",
	// 	avatar: "https://example.com/avatar.png",
	// 	description: "这是一个示例友链",
	// },
	{
		name: "AcoFork Blog",
		url: "https://2x.nz/",
		avatar: "/img/2xnz_headimg_dl.jpg",
		description: "Protect What You Love.",
	},
	{
		name: "Aliya",
		url: "https://rin.1143520.xyz/",
		avatar: "/img/rin.1143520.xyz_.avif",
		description: "【无所事事】我的乐园。",
	},
	{
		name: "FallingSakura",
		url: "https://fallingsakura.top/",
		avatar: "/img/fallingsakura.webp",
		description: "None",
	},
	{
		name: "孤傲导航 – Guao Navs",
		url: "https://guao.de/",
		avatar: "",
		description: "孤傲个人拥有，孤傲导航，乐此书签，简洁导航，云链接，个人导航，个人书签，扩展，多用户",
	},
	{
		name: "皓子的小站",
		url: "https://howiehz.top",
		avatar: "/img/howiehz_ico-r9mky97vapswod6h06tgyav7ch9bs0gtq8u3bz2xy4.webp",
		description: "互联网是一片海洋，网站犹如一座座孤岛漂浮在其上，唯有超链接将它们联系起来。而此处恰好就是一座小岛，欢迎访问皓子的小站。",
	},
	{
		name: "静观小窗",
		url: "https://www.vindo.cn/",
		avatar: "/img/jcblog.com_.cn_.profilephoto-rata12m8yczu269rjguyp94oqwzogcuqk5q6uflie4.webp",
		description: "Developer，业余平面设计，细节控，Archer，南宋｜五代｜北朝历史爱好者。",
	},
];
