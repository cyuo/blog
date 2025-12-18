---
title: 利用脚本快速给 VPS，VDS 云服务器重装系统
published: 2025-07-30
description: ''
image: ''
tags: []
category: '技术教程'
draft: false 
lang: ''
---
经实测，无论是阿里云、NetCup 等大型云服务商，还是一些小型商家甚至个人运营的 KVM、Hyper-V 服务器，本脚本都能正常使用。

本脚本不支持 OpenVZ 或 LXC 虚拟化环境。对于此类虚拟机，建议使用  
<https://github.com/LloydAsp/OsMutation>  
进行操作系统重装。

如果你仅将云服务器用作 Docker 或 Kubernetes 的宿主机，对系统兼容性要求不高，推荐选择 Alpine 系统。它极为轻量，开机默认内存占用甚至不足 100MB。

如需更好的软件兼容性，建议安装 Debian minimal。其内存占用仅略高于 200MB，兼容性优秀。可惜目前本脚本仅支持 Ubuntu minimal，尽管系统占用略高于 Debian minimal，但依然是个不错的选择。

## 亮点

- 支持一键安装 19 种主流 Linux 发行版
- 支持一键安装 Windows，使用微软官方 ISO 自动部署，包含 Virtio 驱动等
- 支持任意方向重装，如 Linux → Linux、Linux → Windows、Windows → Linux 等
- 自动识别网络类型，支持 /32、/128、网关不在子网内、纯 IPv6、双网卡 等复杂网络结构
- 适配低配 VPS，比官方 Netboot 占用更少资源
- 通过分区表 ID 精确识别硬盘，避免误操作
- 兼容 BIOS 与 EFI 启动方式，支持 ARM 架构
- 不含自制软件包，所有安装源均实时下载自官方镜像站

原系统可以是表格中的任意系统。

目标系统的配置要求如下：

| 系统 | 版本 | 内存 | 硬盘 |
|---|---|---|---|
| Alpine | 3.19, 3.20, 3.21, 3.22 | 256 MB | 1 GB |
| Debian | 9, 10, 11, 12 | 256 MB | 1 ~ 1.5 GB ^ |
| Kali | 滚动 | 256 MB | 1 ~ 1.5 GB ^ |
| Ubuntu | 16.04 LTS - 24.04 LTS, 25.04 | 512 MB * | 2 GB |
| Anolis | 7, 8, 23 | 512 MB * | 5 GB |
| RHEL / AlmaLinux / Rocky / Oracle | 8, 9, 10（如果有） | 512 MB * | 5 GB |
| OpenCloudOS | 8, 9, Stream 23 | 512 MB * | 5 GB |
| CentOS Stream | 9, 10 | 512 MB * | 5 GB |
| Fedora | 41, 42 | 512 MB * | 5 GB |
| openEuler | 20.03 LTS - 24.03 LTS, 25.03 | 512 MB * | 5 GB |
| openSUSE | Leap 15.6, Tumbleweed（滚动） | 512 MB * | 5 GB |
| NixOS | 25.05 | 512 MB | 5 GB |
| Arch | 滚动 | 512 MB | 5 GB |
| Gentoo | 滚动 | 512 MB | 5 GB |
| 安同 OS | 滚动 | 512 MB | 5 GB |
| 飞牛 fnOS | 公测 | 512 MB | 8 GB |
| Windows (DD) | 任何 | 512 MB | 取决于镜像 |
| Windows (ISO) | Vista, 7, 8.x（Server 2008 - 2012 R2） | 512 MB | 25 GB |
| Windows (ISO) | 10, 11（Server 2016 - 2025） | 1 GB | 25 GB |

## 下载

**国外服务器：**

```bash
curl -O https://raw.githubusercontent.com/bin456789/reinstall/main/reinstall.sh || \
wget -O reinstall.sh $_
````

**国内服务器：**

```bash
curl -O https://cnb.cool/bin456789/reinstall/-/git/raw/main/reinstall.sh || \
wget -O reinstall.sh $_
```

## 重装

以下操作需要 root 权限，建议使用以下命令切换至 root 用户并进入其主目录：

```bash
sudo -i
```

进入脚本所在目录，执行如下命令开始安装：

```bash
bash reinstall.sh {os} {release}
```

如未指定版本号，默认安装对应系统的最新稳定版。

例如，要安装 Alpine 3.22：

```bash
bash reinstall.sh alpine 3.22
```

运行后重启系统，即可自动开始系统重装：

```bash
reboot
```

⚠️ **安全提醒**

建议不要直接重启，因为默认配置下，SSH 将使用以下弱密码登入：

| 项目  | 值      |
| --- | ------ |
| 端口  | 22     |
| 用户名 | root   |
| 密码  | 123@@@ |

这非常不安全。请务必通过 `--password` 参数自定义强密码。

此外，建议使用 `--ssh-port` 更改 SSH 默认端口 22，避免被扫描攻击。

示例：

```bash
bash reinstall.sh alpine 3.22 \
  --password "my.serv!233@passwd" \
  --ssh-port 22022
```
此外，建议使用 --ssh-port 更改 SSH 默认端口 22，避免被扫描攻击。

示例：

```bash
bash reinstall.sh alpine 3.22 --password "my.serv!233@passwd" --ssh-port 22022bash reinstall.sh alpine 3.22 --password "my.serv!233@passwd" --ssh-port 22022
```

如使用密码登入，强烈建议安装 fail2ban，防止 SSH 被暴力破解。

为了更高安全性，推荐完全禁用密码登入，改用 SSH Key。使用 --ssh-key 参数可直接指定公钥或文件路径。

如果你当前已经配置了 SSH Key，通常可以在 ~/.ssh/authorized_keys 中找到它，直接作为参数传入：

```bash
bash reinstall.sh alpine 3.22 --ssh-port 22022 --ssh-key ~/.ssh/authorized_keysbash reinstall.sh alpine 3.22 --ssh-port 22022 --ssh-key ~/.ssh/authorized_keys
```

若尚未生成 SSH Key，可使用 Termius 等工具创建。生成步骤如下：

+ 打开 Termius

+ 点击左上角「Vaults」，再点击左侧「Keychain」

+ 点击右侧的向下箭头，选择「Generate Key」

+ 按需填写参数，建议使用 ED25519 算法

+ 点击「Generate & Save」，再点击右下角「Export to Host」

+ 选择目标主机，点击「Export and Attach」即可完成导出

重装完成后，请编辑 SSH 凭据，删除密码。

注意：即使你仅指定了 SSH Key，系统也不会自动关闭密码登入。请在新系统中手动编辑 /etc/ssh/sshd_config，添加以下配置：

```
PermitRootLogin prohibit-password  # 禁止 root 密码登录
PubkeyAuthentication yes           # 启用 SSH Key 登录
PasswordAuthentication no          # 禁止密码登录PermitRootLogin prohibit-password  # 禁止 root 密码登录
PubkeyAuthentication yes           # 启用 SSH Key 登录
PasswordAuthentication no          # 禁止密码登录
```

至此，你已顺利完成系统重装，并成功配置安全的 SSH 登录方式！