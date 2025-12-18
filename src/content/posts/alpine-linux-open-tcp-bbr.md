---
title: Alpine Linux 开启 TCP BBR
published: 2025-08-18
description: ''
image: ''
tags: [alpine, bbr]
category: '技术教程'
draft: false 
lang: ''
---
以下所有操作均需在 root 用户下执行，非 root 先切换到 root 用户

```bash
sudo -i
```

随后配置开启 BBR

```bash
nano /etc/sysctl.d/00-bbr.conf

# 添加如下文本后保存退出
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```

以上操作需要重启生效

```bash
reboot
```

重新连接后，可以运行如下指令。如果输出中与此类似就是生效了。

```bash
❯ lsmod | grep bbr
tcp_bbr                20480  20
❯ sysctl net.core.default_qdisc
net.core.default_qdisc = fq
❯ sysctl net.ipv4.tcp_congestion_control
net.ipv4.tcp_congestion_control = bbr
```

至此，我们已经在 Alpine 中成功配置了 TCP BBR 模块。