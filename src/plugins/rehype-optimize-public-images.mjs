import { getImage } from "astro:assets";
import { visit } from "unist-util-visit";

/**
 * Rehype 插件：自动优化 /img/ 路径的图片
 */
export function rehypeOptimizePublicImages() {
	return async (tree, _file) => {
		const images = [];

		// 收集所有需要优化的图片
		visit(tree, "element", (node) => {
			if (node.tagName === "img" && node.properties?.src) {
				const src = node.properties.src;
				if (typeof src === "string" && src.startsWith("/img/")) {
					images.push({ node, src });
				}
			}
		});

		// 优化图片
		for (const { node, src } of images) {
			try {
				const optimized = await getImage({
					src: `./public${src}`,
					format: "webp",
					quality: 85,
				});

				node.properties.src = optimized.src;
				node.properties.width = optimized.attributes.width;
				node.properties.height = optimized.attributes.height;
			} catch (error) {
				console.warn(
					`[rehype-optimize-public-images] 无法优化图片 ${src}:`,
					error.message,
				);
			}
		}
	};
}
