import { visit } from "unist-util-visit";

/**
 * Remark 插件：优化图片路径
 */
export function remarkOptimizePublicImages() {
	return (tree, _file) => {
		visit(tree, "image", (_node) => {
			// 不再对 /img/ 路径做特殊处理
			// 所有图片路径保持原样
		});
	};
}
