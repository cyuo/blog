---
title: 一次为 WordPress 自定义新功能
published: 2025-09-12
description: ''
image: ''
tags: [wordpress, misc]
category: '杂项'
draft: false 
lang: ''
---
最近对站点做了一些小改进。

文章永久链接新增占位符 %UUID%，基于 INT 128 自动生成。这样以后就不用为了 URL 手动把标题翻译成英文了，而且 UUID 的长度通常比大部分翻译后的文本更短、更简洁。

另外，目前我用的 WordPress 主题 Ruki 并没有内置友链页面模板。之前我是借助 Elementor Pro 手动搭建，每次增删链接都很麻烦。现在我写了一个小插件，把友链管理整合进了 WordPress 自带的“链接管理”页面，以后更新起来就方便多了。