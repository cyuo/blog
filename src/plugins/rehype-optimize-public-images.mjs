import { visit } from "unist-util-visit";

/**
 * Rehype 插件：优化图片路径
 */
export function rehypeOptimizePublicImages() {
	return async (tree, _file) => {
		// 不再对 /img/ 路径做特殊处理
		// 所有图片路径保持原样
		visit(tree, "element", (_node) => {
			// 占位函数，保持插件结构
		});
	};
}
