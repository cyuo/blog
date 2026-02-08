import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import type { AstroRemarkFile } from "./astro-frontmatter";
import { ensureAstroFrontmatter } from "./astro-frontmatter";

type RemarkReadingTimeTransformer = (tree: Root, file: AstroRemarkFile) => void;

export function remarkReadingTime(): RemarkReadingTimeTransformer {
	return (tree: Root, file: AstroRemarkFile): void => {
		const textOnPage = mdastToString(tree);
		const readingTime = getReadingTime(textOnPage);
		const frontmatter = ensureAstroFrontmatter(file);
		frontmatter.minutes = Math.max(1, Math.round(readingTime.minutes));
		frontmatter.words = readingTime.words;
	};
}
