---
title: 如何在 WordPress 内插入 Bilibili 视频？
published: 2025-08-21
description: ''
image: ''
tags: [wordpress, bilibili]
category: '技术教程'
draft: false 
lang: ''
---
## 操作步骤

### 1. 获取嵌入代码
1. 用 Web 端 Bilibili 打开你想插入的视频
2. 选择 **分享** → **嵌入代码**

### 2. 在 WordPress 中粘贴代码
1. 在 WordPress Gutenberg 编辑器内选择 **新区块** → **自定义代码**
2. 粘贴刚才复制的嵌入代码

原始嵌入代码示例：
```html
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1156257664&bvid=BV12Z421T7Uk&cid=1624024342&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
```

### 3. 添加样式设置
在 `<iframe>` 标签末尾插入以下代码：
```html
style="width:100%;height:500px;"
```

### 4. 最终代码
完成后的完整代码应类似这样：
```html
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1156257664&bvid=BV12Z421T7Uk&cid=1624024342&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:100%;height:500px;"></iframe>
```

## 说明
- `width:100%` 让视频宽度自适应容器
- `height:500px` 设置视频播放器的高度，可根据需要调整
- 这种方法确保 Bilibili 视频在 WordPress 中正确显示并保持响应式布局