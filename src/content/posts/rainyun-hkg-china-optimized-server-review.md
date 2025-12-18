---
title: 雨云 香港 极速三网CN2/CMI/CUG 服务器 高防线路 测评
published: 2025-08-06
description: ''
image: ''
tags: []
category: '产品评测'
draft: false 
lang: ''
---

官方宣称其直连高防线路延迟在 60ms。但我本地测试延迟非常不稳定，在 80-110 ms 之间抖动。

看完融合怪结果后我发现我的 100ms 延迟居然算还不错的，浙江电信，华东地区到香港延迟居然能上 260ms。和没有任何大陆优化的服务器大差不差。

即便考虑到近期是香港网络攻击频发时期，作为一条**直连高防**线路，这样的延迟表现也难以令人接受。虽然另一组浙江电信测试延迟为 105ms，但 262ms 的出现暴露了线路稳定性的极大问题。

这台服务器 CPU 为 AMD EYPC 7702，融合怪脚本单核心跑分 1419.51。

这个性能是什么水平？作为对比，它大约仅为我之前测试的 Netcup G11 活动款（[netcup Root Server G11 活动翻倍款 测评](https://zrn.net/rs-g11-review/)）性能的40%，表现相当羸弱，难以胜任计算密集型任务。

说起来我一直不清楚这个脚本用的什么跑分软件，从数据上看起来应该是 Geekbench 6。

尽管商家宣称拥有 CN2/CMI/CUG 三网优化，但实际测试结果却狠狠地打了脸。

根据回程路由检测，真实情况如下：

- **中国电信**：全程 163 骨干网，普通线路。
- **中国联通**：全程 AS4837（169网），普通线路。
- **中国移动**：全程 CMIN2，**精品线路**。

我观察了一下其他人的评测，普通线路的路由也是一个样子，不过延迟稍微低一点。移动直连 30ms，联通电信普遍 60ms。

结果一目了然：所谓的“三网优化”实际上只是“单网优化”。在当前市场环境下，由于移动与 Lumen 的对等互联，许多香港 VPS 都能轻松实现移动 CMIN2 直连。而那些服务商在同等价位下，往往提供的是 1000Mbps 级别的大带宽，而非此处的 10Mbps。

我测试的服务器是 4vCPU-4G 的配置，不限流量的情况下给出 10Mbps 带宽。

如果你觉得带宽太小，想选择限流的大带宽套餐，那么现实会更加残酷：

- 限流套餐下价格一致，带宽有 40Mbps，倒是够用了。
- 同配置 40Mbps 带宽套餐：每月仅包含 **50GB** 流量。
- 流量追加费用：最优惠的选项是 **180元/200GB**，折合 **0.9元/GB**。

需要强调的是，这并非高防线路的专属价格，其普通线路亦是如此。

这个价格之间打破了我的固有印象——小厂比大厂更实惠。

作为对比，阿里云香港 BGP（多线）类型，三网直连 30ms，20 每个月的服务器就有 200Mbps，流量计费每个月**前 200GB 免费**，超出部分 0.7元/GB（对，可以按 GB 计费，不需要你买流量包。更优惠在 10TB 后面了，我觉得普通用户用不到）。可以说我第一次看到大厂性价比方面居然能打小厂的。

这个对比堪称“降维打击”。阿里云不仅线路质量更优、带宽更大、免费流量更多，就连超额流量的单价都更便宜。

考虑到这台服务器在不开高防的情况下，月费也要 69 元。结合其不稳定的高延迟、羸弱的 CPU 性能、名不副实的网络优化以及毫无竞争力的价格，我实在想不出有什么理由推荐它。

至于 104元/月 的直连高防版本，也许对于有特定高防需求且能容忍上述所有缺点的用户有其价值，但我无法做出评价。对于绝大多数普通用户而言，市面上有大量比它更优秀、更具性价比的选择。

下面放上融合怪结果。

## 融合怪

```
-------------------------------------VPS融合怪测试-------------------------------------
版本：v0.1.74
测评频道: https://t.me/vps_reviews
Go项目地址：https://github.com/oneclickvirt/ecs
Shell项目地址：https://github.com/spiritLHLS/ecs
--------------------------------------系统基础信息--------------------------------------
 CPU 型号            : AMD EPYC 7702 64-Core Processor @ 1996.249 MHz
 CPU 数量            : 4 Virtual CPU(s)
 CPU 缓存            : L1: 512 KB / L2: 2 MB / L3: 64 MB
 AES-NI              : ✔️ Enabled
 VM-x/AMD-V/Hyper-V  : ✔️ Enabled
 内存                : 681.82 MB / 3.82 GB
 气球驱动            : ✔️ Enabled
 内核页合并          : ❌ Undetected
 虚拟内存 Swap       : [ no swap partition or swap file detected ]
 硬盘空间            : 4.99 GB / 29.42 GB [16.9%] /dev/sda1 - /
 启动盘路径          : /dev/sda1
 系统                : debian 12.8 [x86_64]
 内核                : 6.1.0-27-amd64
 系统在线时间        : 0 days, 00 hours, 19 minutes
 时区                : CST
 负载                : 0.18 / 0.20 / 0.15
 虚拟化架构          : KVM
 NAT类型             : Inconclusive
 TCP加速方式         : bbr
 IPV4 ASN            : AS979 NetLab
 IPV4 Location       : Hoi Fu Court / Yau Tsim Mong / HK
 IPV4 Active IPs     : 70/256 (subnet /24) 531968/16777216 (prefix /8)
--------------------------------CPU测试-通过sysbench测试--------------------------------
1 线程测试(单核)得分:   1419.51
4 线程测试(多核)得分:   5788.57
--------------------------------内存测试-通过sysbench测试---------------------------------
单线程顺序写速度: 15126.52 MB/s(15.86K IOPS, 5s)
单线程顺序读速度: 32949.38 MB/s(34.55K IOPS, 5s)
-----------------------------------硬盘测试-通过fio测试-----------------------------------
测试路径      块大小   读测试(IOPS)            写测试(IOPS)            总和(IOPS)
/root         4k       92.64 MB/s(23.2k)       92.89 MB/s(23.2k)       185.53 MB/s(46.4k)
/root         64k      1.50 GB/s(23.4k)        1.51 GB/s(23.6k)        3.01 GB/s(47.0k)
/root         512k     1.92 GB/s(3746)         2.02 GB/s(3945)         3.94 GB/s(7691)
/root         1m       2.00 GB/s(1956)         2.14 GB/s(2086)         4.14 GB/s(4042)
-------------------------------------御三家流媒体解锁-------------------------------------
----------------Netflix-----------------
[IPV4]
您的出口IP完整解锁Netflix，支持非自制剧的观看
NF所识别的IP地域信息：美国
[IPV6]
您的网络可能没有正常配置IPv6，或者没有IPv6网络接入
----------------Youtube-----------------
[IPV4]
连接方式: Youtube Video Server
视频缓存节点地域: IAD(IAD30S49)
Youtube识别地域: 中国香港(HK)
[IPV6]
Youtube在您的出口IP所在的国家不提供服务
---------------DisneyPlus---------------
[IPV4]
当前IPv4出口所在地区即将开通DisneyPlus
[IPV6]
DisneyPlus在您的出口IP所在的国家不提供服务
-------------------------------------跨国流媒体解锁--------------------------------------
IPV4:
============[ 跨国平台 ]============
Apple                     YES (Region: HKG)
BingSearch                YES (Region: HK)
Claude                    YES
Dazn                      YES (Region: HK)
Disney+                   YES (Region: US)
Gemini                    NO
GoogleSearch              YES
Google Play Store         YES (Region: HK)
IQiYi                     YES (Region: HK)
Instagram Licensed Audio  NO (Network Err)
KOCOWA                    NO
MetaAI                    YES (Region: US)
Netflix                   NO (Network Err)
Netflix CDN               US
OneTrust                  YES (Region: HK YAU TSIM MONG)
ChatGPT                   YES (Only Available with Mobile APP)
Paramount+                YES
Amazon Prime Video        YES (Region: US)
Reddit                    YES
SonyLiv                   YES (Region: HK)
Sora                      Banned (VPN Blocked)
Spotify Registration      NO
Steam Store               YES (Community Available) (Region: HK)
TVBAnywhere+              YES (Region: HK)
TikTok                    NO
Viu.com                   YES
Wikipedia Editability     NO
YouTube Region            YES (Region: HK)
YouTube CDN               IAD
--------------------------------------IP质量检测--------------------------------------
以下为各数据库编号，输出结果后将自带数据库来源对应的编号
ipinfo数据库  [0] | scamalytics数据库 [1] | virustotal数据库   [2] | abuseipdb数据库   [3] | ip2location数据库    [4]
ip-api数据库  [5] | ipwhois数据库     [6] | ipregistry数据库   [7] | ipdata数据库      [8] | db-ip数据库          [9]
ipapiis数据库 [A] | ipapicom数据库    [B] | bigdatacloud数据库 [C] | dkly数据库        [D] | ipqualityscore数据库 [E]
IPV4:
安全得分:
声誉(越高越好): 0 [2]
信任得分(越高越好): 3 [8]
VPN得分(越低越好): 98 [8]
代理得分(越低越好): 100 [8]
社区投票-无害: 0 [2]
社区投票-恶意: 0 [2]
威胁得分(越低越好): 93 [8]
欺诈得分(越低越好): 24 [1] 65 [E]
滥用得分(越低越好): 0 [3]
ASN滥用得分(越低越好): 0.0017 (Low) [A]
公司滥用得分(越低越好): 0.0001 (Very Low) [A]
威胁级别: low [9]
黑名单记录统计:(有多少黑名单网站有记录):
无害记录数: 0 [2]  恶意记录数: 0 [2]  可疑记录数: 0 [2]  无记录数: 94 [2]
安全信息:
使用类型: hosting - high probability [C] corporate [9] business [0 7 8] hosting [A] Commercial [3]
公司类型: isp [0 7 A]
是否云提供商: No [7]
是否数据中心: Yes [1 C] No [0 5 6 8 A]
是否移动设备: Yes [E] No [5 A C]
是否代理: No [0 1 4 5 6 7 8 9 A C] Yes [E]
是否VPN: Yes [E] No [0 1 6 7 A C]
是否TorExit: No [1 7]
是否Tor出口: No [1 7]
是否网络爬虫: No [9 A E]
是否匿名: No [1 6 7 8]
是否攻击者: No [7 8]
是否滥用者: No [7 8 A C E]
是否威胁: No [7 8 C]
是否中继: No [0 7 8 C]
是否Bogon: No [7 8 A C]
是否机器人: No [E]
--------------------------------------邮件端口检测--------------------------------------
Platform  SMTP  SMTPS POP3  POP3S IMAP  IMAPS
LocalPort ✔     ✔     ✔     ✔     ✔     ✔
QQ        ✘     ✔     ✘     ✘     ✘     ✘
163       ✘     ✔     ✘     ✘     ✘     ✘
Sohu      ✘     ✔     ✘     ✘     ✘     ✘
Yandex    ✘     ✔     ✘     ✘     ✘     ✘
Gmail     ✘     ✔     ✘     ✘     ✘     ✘
Outlook   ✘     ✘     ✘     ✘     ✘     ✘
Office365 ✘     ✘     ✘     ✘     ✘     ✘
Yahoo     ✘     ✔     ✘     ✘     ✘     ✘
MailCOM   ✘     ✔     ✘     ✘     ✘     ✘
MailRU    ✘     ✔     ✘     ✘     ✘     ✘
AOL       ✘     ✔     ✘     ✘     ✘     ✘
GMX       ✘     ✔     ✘     ✘     ✘     ✘
Sina      ✘     ✘     ✘     ✘     ✘     ✘
Apple     ✘     ✔     ✘     ✘     ✘     ✘
FastMail  ✘     ✔     ✘     ✘     ✘     ✘
ProtonMail✘     ✘     ✘     ✘     ✘     ✘
MXRoute   ✘     ✘     ✘     ✘     ✘     ✘
Namecrane ✘     ✘     ✘     ✘     ✘     ✘
XYAMail   ✘     ✘     ✘     ✘     ✘     ✘
ZohoMail  ✘     ✔     ✘     ✘     ✘     ✘
Inbox_eu  ✘     ✔     ✘     ✘     ✘     ✘
Free_fr   ✘     ✘     ✘     ✘     ✘     ✘
------------------------------------上游及回程线路检测-------------------------------------
北京电信v4 219.141.140.10           电信163    [普通线路]
北京联通v4 202.106.195.68  检测不到回程路由节点的IPV4地址
北京移动v4 221.179.155.161          移动CMIN2  [精品线路]
上海电信v4 202.96.209.133           电信163    [普通线路]
上海联通v4 210.22.97.1              联通4837   [普通线路]
上海移动v4 211.136.112.200          移动CMIN2  [精品线路]
广州电信v4 58.60.188.222            电信163    [普通线路]
广州联通v4 210.21.196.6             联通4837   [普通线路]
广州移动v4 120.196.165.24           移动CMIN2  [精品线路]
成都电信v4 61.139.2.69              电信163    [普通线路]
成都联通v4 119.6.6.6                联通4837   [普通线路]
成都移动v4 211.137.96.205           移动CMIN2  [精品线路]
-------------------------------------三网回程路由检测-------------------------------------
广州电信 - ICMP v4 - traceroute to 58.60.188.222, 30 hops max, 52 byte packets
*
0.70 ms      *
*
0.90 ms      AS4134     [APNIC-AP]         中国, 香港, www.chinatelecom.com.cn
*
56.69 ms     AS4134     [CHINANET-BB]      中国, 广东, 广州, www.chinatelecom.com.cn
*
60.99 ms     AS4134     [CHINANET-GD]      中国, 广东, 深圳, www.chinatelecom.com.cn  电信
*
广州联通 - ICMP v4 - traceroute to 210.21.196.6, 30 hops max, 52 byte packets
5.65 ms      AS979                         中国, 香港, as979.net
0.96 ms      *
*
1.51 ms      *          [CUG-ASIA]         中国, 香港
*
2.56 ms      AS10099    [CUG-BACKBONE]     中国, 香港, chinaunicomglobal.com  联通
77.62 ms     AS10099    [CUG-BACKBONE]     中国, 香港, chinaunicomglobal.com  联通
77.34 ms     AS4837     [CU169-BACKBONE]   中国, 广东, 广州, chinaunicom.cn
73.77 ms     AS4837     [CU169-BACKBONE]   中国, 广东, 广州, chinaunicom.cn  联通
78.69 ms     AS4837     [CU169-BACKBONE]   中国, 广东, 广州, chinaunicom.cn  联通
*
84.83 ms     AS17623    [APNIC-AP]         中国, 广东, 深圳, chinaunicom.cn  联通
81.07 ms     AS17623                       中国, 广东, 深圳, chinaunicom.cn  联通
广州移动 - ICMP v4 - traceroute to 120.196.165.24, 30 hops max, 52 byte packets
1.91 ms      AS979                         中国, 香港, as979.net
0.74 ms      *
*
6.42 ms      AS58807    [CMIN2-NET]        中国, 广东, 广州, cmi.chinamobile.com  移动
6.63 ms      AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
6.34 ms      AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
9.43 ms      AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
35.41 ms     AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
42.58 ms     AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
39.09 ms     AS56040    [APNIC-AP]         中国, 广东, 深圳, gd.10086.cn  移动
--------------------------------------就近节点测速--------------------------------------
位置            上传速度        下载速度        延迟            丢包率
Speedtest.net   8.99 Mbps       12.61 Mbps      0.53 ms         0.0%
中国香港        9.84 Mbps       9.91 Mbps       2.25 ms         0.0%
日本东京        9.81 Mbps       9.91 Mbps       144.92 ms       0.0%
联通上海5G      10.00 Mbps      9.91 Mbps       90.94 ms        Not available.
电信浙江        10.25 Mbps      6.65 Mbps       262.95 ms       Not available.
电信浙江        9.44 Mbps       9.93 Mbps       105.87 ms       Not available.
移动Suzhou      9.78 Mbps       0.92 Mbps       105.29 ms       1.0%
----------------------------------------------------------------------------------
花费          : 12 分 48 秒
时间          : Tue Aug 5 23:46:37 CST 2025
----------------------------------------------------------------------------------
```