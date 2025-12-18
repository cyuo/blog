---
title: Alpine Linux 安装 Oh-My-Zsh 并配置 P10K 主题和常用插件
published: 2025-08-18
description: ''
image: ''
tags: [alpine, zsh]
category: '技术教程'
draft: false 
lang: ''
---
切换到用户目录

```bash
cd ~
```

安装必要依赖和 ZSH（本文默认以 root 用户操作，非 root 记得必要时使用 sudo 权限）

```bash
apk add zsh git curl nano
```

设置 ZSH 为默认 Shell

```bash
nano /etc/passwd
```

修改第一行 /bin/sh 为 /bin/zsh（如果非 root 用户请修改对应用户配置）

```plaintext
root:x:0:0:root:/root:/bin/zsh
```

依次按下 Ctrl-O，Y，Ctrl-X 保存并退出（nano 的提示非常完整，不懂可以看下方提示）。

安装 Oh-My-Zsh

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装自动补全插件，这个插件会根据你的历史命令来提供命令建议。

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

安装语法高亮插件，这个插件会在你输入命令时实时高亮显示，方便纠错。

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

打开 .zshrc 文件，在 plugins=(…) 这一行中添加刚才安装的插件。

```zsh
nano ~/.zshrc

# 找到 plugins=() 这一行，修改为：
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

安装 Powerlevel10k 主题，Powerlevel10k 是一个非常流行且功能强大的 Zsh 主题。

```zsh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

打开 .zshrc 文件，将主题设置为 powerlevel10k/powerlevel10k。

```zsh
nano ~/.zshrc

# 找到 ZSH_THEME="robbyrussell" 这一行，修改为：
ZSH_THEME="powerlevel10k/powerlevel10k"
```

然后开始配置主题

```zsh
source ~/.zshrc
```

接下来跟着提示，按自己喜好配置即可。

源码安装 autojump 插件。Autojump 可以让你快速跳转到你经常访问的目录。由于 Alpine 官方仓库没有 autojump 包，我们需要从 GitHub 源代码安装。

安装依赖

```zsh
apk add python3
```

从 GitHub 源代码安装

```zsh
# 克隆 autojump 仓库
git clone https://github.com/wting/autojump.git
# 进入目录
cd autojump
# 执行安装脚本
./install.py
```

执行安装脚本后，它会提示你将一些代码添加到你的 .zshrc 文件末尾，以启用 autojump。如果你是 root 用户，通常这些代码是：

```zsh
[\[ -s /root/.autojump/etc/profile.d/autojump.sh \]] && source /root/.autojump/etc/profile.d/autojump.sh
autoload -U compinit && compinit -u
```

如果不是，请把 /root 换成对应用户的 home 目录。

自此，Oh-My-Zsh 安装与常用插件主题配置完成！