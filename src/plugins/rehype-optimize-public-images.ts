import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

type RehypeOptimizePublicImagesTransformer = (
	tree: Root,
	file: unknown,
) => Promise<void>;

/**
 * Rehype 插件：优化图片路径
 */
export function rehypeOptimizePublicImages(): RehypeOptimizePublicImagesTransformer {
	return async (tree: Root, _file: unknown): Promise<void> => {
		// 不再对 /img/ 路径做特殊处理
		// 所有图片路径保持原样
		visit(tree, "element", (_node: Element): void => {
			// 占位函数，保持插件结构
		});
	};
}
