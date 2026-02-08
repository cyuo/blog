import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import type { AstroRemarkFile } from "./astro-frontmatter";
import { ensureAstroFrontmatter } from "./astro-frontmatter";

type RemarkExcerptTransformer = (tree: Root, file: AstroRemarkFile) => void;

/* Use the post's first paragraph as the excerpt */
export function remarkExcerpt(): RemarkExcerptTransformer {
	return (tree: Root, file: AstroRemarkFile): void => {
		let excerpt = "";
		for (const node of tree.children) {
			if (node.type !== "paragraph") {
				continue;
			}
			excerpt = mdastToString(node);
			break;
		}
		const frontmatter = ensureAstroFrontmatter(file);
		frontmatter.excerpt = excerpt;
	};
}
