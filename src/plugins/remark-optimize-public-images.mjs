import { visit } from "unist-util-visit";

/**
 * Remark 插件：将 markdown 中的 /img/ 图片路径转换为 assets 路径
 * 使用方法：先手动将 public/img 的图片复制到 src/assets/img
 */
export function remarkOptimizePublicImages() {
	return (tree, _file) => {
		visit(tree, "image", (node) => {
			if (node.url?.startsWith("/img/")) {
				// 提取文件名
				const filename = node.url.replace("/img/", "");
				// 转换为相对于 content/posts 的路径
				node.url = `../../assets/img/${filename}`;
			}
		});
	};
}
