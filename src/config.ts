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
	title: "Zirkeln",
	subtitle: "Yet another Fuwari blog site",
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
		}
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
		}
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://i.zrn.net/pic/seia_avatar_15278c5941.webp",
	name: "Poi",
	bio: "Darkness cannot drive out darkness, only light can do that. Hate cannot drive out hate, only love can do that. - Martin Luther King, Jr.",
	links: [

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
	theme: "github-dark",
};

export const friends: Friend[] = [
	{
		name: "孤傲导航 – Guao Navs",
		url: "https://guao.de/",
		avatar: "",
		description: "孤傲个人拥有，孤傲导航，乐此书签，简洁导航，云链接，个人导航，个人书签，扩展，多用户",
	},
	{
		name: "AcoFork Blog",
		url: "https://2x.nz/",
		avatar: "https://i.zrn.net/pic/2xnz_headimg_dl_b8d43a96fe.jpg",
		description: "Protect What You Love.",
	},
	{
		name: "Aliya",
		url: "https://rin.1143520.xyz/",
		avatar: "https://i.zrn.net/pic/rin_1143520_xyz_3f170452ed.avif",
		description: "【无所事事】我的乐园。",
	},
	{
		name: "FallingSakura",
		url: "https://fallingsakura.top/",
		avatar: "https://i.zrn.net/pic/fallingsakura_badbe54a29.webp",
		description: "None",
	},
	{
		name: "皓子的小站",
		url: "https://howiehz.top",
		avatar: "https://i.zrn.net/pic/howiehz_ico_r9mky97vapswod6h06tgyav7ch9bs0gtq8u3bz2xy4_56abf3536d.webp",
		description: "互联网是一片海洋，网站犹如一座座孤岛漂浮在其上，唯有超链接将它们联系起来。而此处恰好就是一座小岛，欢迎访问皓子的小站。",
	},
	{
		name: "静观小窗",
		url: "https://www.vindo.cn/",
		avatar: "https://i.zrn.net/pic/jcblog_com_cn_profilephoto_rata12m8yczu269rjguyp94oqwzogcuqk5q6uflie4_b61e4c0e28.webp",
		description: "Developer，业余平面设计，细节控，Archer，南宋｜五代｜北朝历史爱好者。",
	}
];
