import type { Image, Root } from "mdast";
import { visit } from "unist-util-visit";
import type { AstroRemarkFile } from "./astro-frontmatter";

type RemarkOptimizePublicImagesTransformer = (
	tree: Root,
	file: AstroRemarkFile,
) => void;

/**
 * Remark 插件：优化图片路径
 */
export function remarkOptimizePublicImages(): RemarkOptimizePublicImagesTransformer {
	return (tree: Root, _file: AstroRemarkFile): void => {
		visit(tree, "image", (_node: Image): void => {
			// 不再对 /img/ 路径做特殊处理
			// 所有图片路径保持原样
		});
	};
}
