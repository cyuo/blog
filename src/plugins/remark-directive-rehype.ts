import type { Element, Properties } from "hast";
import { h } from "hastscript";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { AstroRemarkFile } from "./astro-frontmatter";

type DirectiveNodeType =
	| "containerDirective"
	| "leafDirective"
	| "textDirective";

interface DirectiveChild {
	data?: Record<string, unknown> & {
		directiveLabel?: boolean;
	};
}

interface DirectiveData extends Record<string, unknown> {
	hName?: string;
	hProperties?: Properties;
}

interface DirectiveNode {
	type: DirectiveNodeType;
	name: string;
	attributes?: Properties;
	children: DirectiveChild[];
	data?: DirectiveData;
}

type ParseDirectiveNodeTransformer = (
	tree: Root,
	file: AstroRemarkFile,
) => void;

function isDirectiveNode(node: unknown): node is DirectiveNode {
	if (!node || typeof node !== "object") {
		return false;
	}

	const candidate = node as {
		type?: unknown;
		name?: unknown;
		children?: unknown;
	};

	return (
		(candidate.type === "containerDirective" ||
			candidate.type === "leafDirective" ||
			candidate.type === "textDirective") &&
		typeof candidate.name === "string" &&
		Array.isArray(candidate.children)
	);
}

function hasDirectiveLabel(node: DirectiveNode): boolean {
	const firstChild = node.children[0];
	return firstChild?.data?.directiveLabel === true;
}

export function parseDirectiveNode(): ParseDirectiveNodeTransformer {
	return (tree: Root, _file: AstroRemarkFile): void => {
		visit(tree, (node: unknown): void => {
			if (!isDirectiveNode(node)) {
				return;
			}

			let data = node.data;
			if (!data) {
				data = {};
				node.data = data;
			}

			let attributes = node.attributes;
			if (!attributes) {
				attributes = {};
				node.attributes = attributes;
			}

			if (hasDirectiveLabel(node)) {
				// Add a flag to the node to indicate that it has a directive label.
				attributes["has-directive-label"] = true;
			}

			const element = h(node.name, attributes) as Element;
			data.hName = element.tagName;
			data.hProperties = element.properties;
		});
	};
}
