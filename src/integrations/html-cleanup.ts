import { promises as fs } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

/**
 * Astro 集成：在构建完成后清理 HTML 文件
 * 删除注释和所有换行，压缩空白，不影响 swup 功能
 */
export function htmlCleanupIntegration(): AstroIntegration {
	return {
		name: "html-cleanup",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const outDir = fileURLToPath(dir);
				logger.info(`[html-cleanup] 开始清理 HTML 文件: ${outDir}`);

				// 递归处理目录中所有 HTML 文件
				async function processHTML(dirPath: string) {
					const entries = await fs.readdir(dirPath, { withFileTypes: true });

					for (const entry of entries) {
						const fullPath = join(dirPath, entry.name);

						if (entry.isDirectory()) {
							await processHTML(fullPath);
						} else if (entry.isFile() && extname(entry.name) === ".html") {
							try {
								let content = await fs.readFile(fullPath, "utf-8");

								// 删除 HTML 注释（<!-- ... -->），但保留条件注释（<!--[if IE]>）
								content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");

								// 保护需要保留格式的标签内容（pre, code, textarea, script, style）
								const preserveTags = [
									"pre",
									"code",
									"textarea",
									"script",
									"style",
								];
								const preserved: Array<{
									placeholder: string;
									content: string;
								}> = [];

								// 提取需要保护的内容
								preserveTags.forEach((tag, index) => {
									const regex = new RegExp(
										`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`,
										"gi",
									);
									content = content.replace(regex, (match, _innerContent) => {
										const placeholder = `__PRESERVED_${tag}_${index}_${preserved.length}__`;
										preserved.push({ placeholder, content: match });
										return placeholder;
									});
								});

								// 删除所有换行和多余空白
								content = content.replace(/\n/g, "");
								content = content.replace(/\s+/g, " "); // 多个空白压缩为一个空格
								content = content.replace(/> </g, "><"); // 标签之间的空格也删除

								// 恢复被保护的内容
								preserved.forEach(
									({ placeholder, content: preservedContent }) => {
										content = content.replace(placeholder, preservedContent);
									},
								);

								await fs.writeFile(fullPath, content, "utf-8");
							} catch (error) {
								logger.error(
									`[html-cleanup] 处理失败 ${fullPath}: ${error instanceof Error ? error.message : String(error)}`,
								);
							}
						}
					}
				}

				await processHTML(outDir);
				logger.info("[html-cleanup] HTML 清理完成");
			},
		},
	};
}
