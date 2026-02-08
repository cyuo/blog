import type { ElementContent, Properties } from "hast";
import { h } from "hastscript";

export type AdmonitionType =
	| "tip"
	| "note"
	| "important"
	| "caution"
	| "warning";

function hasDirectiveLabelFlag(properties: Properties): boolean {
	const flag = properties["has-directive-label"];
	if (typeof flag === "boolean") {
		return flag;
	}

	return flag === "true";
}

export function AdmonitionComponent(
	properties: Properties,
	children: ElementContent[],
	type: AdmonitionType,
): ElementContent {
	if (children.length === 0) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid admonition directive. (Admonition directives must be of block type ":::note{name="name"} <content> :::")',
		);
	}

	let label: ElementContent | null = null;
	let contentChildren = [...children];
	if (hasDirectiveLabelFlag(properties)) {
		const firstChild = contentChildren[0];
		if (firstChild) {
			label = firstChild;
			contentChildren = contentChildren.slice(1);
			if (label.type === "element") {
				label.tagName = "div";
			}
		}
	}

	return h("blockquote", { class: `admonition bdm-${type}` }, [
		h("span", { class: "bdm-title" }, label ?? type.toUpperCase()),
		...contentChildren,
	]);
}
