---
title: netcup Root Server G11 活动翻倍款 测评
published: 2025-07-31
description: ''
image: ''
tags: [netcup]
category: '产品测评'
draft: false 
lang: ''
---

## 提醒汇总

1.  **该机型可以选择离中国最近的地区是欧洲德国。就算你有钱再买一台中国优化线路中转机器，甚至直接买 IPLC，延迟都不可能低于 120ms，因此拿来建站纯折磨。**
2.  **G11 翻倍款虽然硬盘更大，但相对于 G9.5 翻倍款（每月 120TB 后限速），限速规则是每天 3TB 后限速，所以实际能跑的高速流量更少，且应对不了突发流量。所以也不太适合刷流量。**
3.  **netcup 追加存储（Local Block Storage）是 0.01欧/GB/月，性价比不如找大盘机。所以也不适合保种。**
4.  **netcup Root Server 禁用了虚拟化，不要想着开 NAT 小鸡。**
5.  **netcup 退订需要提前一个月，不然你会发现取消时间在下次账单时间+一个周期（通常是一个月）。**
6.  **netcup 有些机器，默认价格是需要你签订长期协议（年），会比月付有优惠，半年付款一次。如果你过了半年后不想要了也要付款，根据不知道哪里来的传言，不付款会被寄律师函。**
7.  **上条加上上条，如果你是按年协议机器没有提前一个月取消，恭喜服务器强制再续费一年。**
8.  **netcup 不提供机器换 IP 服务，额外 IP 强制按年协议。并且不便宜，1.68欧元/月。所以谨慎搞可能导致你的 IP 被屏蔽的服务。**
9.  **如果你有国际互联需求，按照我的经验，netcup 的 IPv6 路由比 IPv4 好。比如我的香港服务器，走 IPv4 访问延迟高达 240ms，速度跑满也只有 1.2Gbps 左右，还经常丢包。但走 IPv6 只有 160ms 延迟，2.5Gbps 轻松跑满，丢包率也不到 1%。**
10. **netcup 虽然给你一个 /64 IPv6 段，但是默认只会把其中一个地址分配到你的服务器。更多地址要你自己手动去后台分配。**
11. **国内不管你用 IPv4 还是 IPv6 去访问，线路都是一坨。不要挣扎了。移动除外。移动用户可以用 IPv6 去访问。它的移动 IPv6 走 CMIN2 精品线路。**

## 机器跑分

网速只有 1Gbps 应该是 Alpine 驱动问题？实际上我装 Ubuntu 的时候可以跑到 2.5 Gbps 的。

```plaintext
-------------------------------------VPS融合怪测试-------------------------------------
版本：v0.1.71
测评频道: https://t.me/vps_reviews
Go项目地址：https://github.com/oneclickvirt/ecs
Shell项目地址：https://github.com/spiritLHLS/ecs
--------------------------------------系统基础信息--------------------------------------
 CPU 型号            : AMD EPYC 9634 84-Core Processor @ 2246.626 MHz
 CPU 数量            : 4 Virtual CPU(s)
 CPU 缓存            : 512 KB
 AES-NI              : ✔️ Enabled
 VM-x/AMD-V/Hyper-V  : ✔️ Enabled
 内存                : 456.80 MB / 7.77 GB
 气球驱动            : ✔️ Enabled
 内核页合并          : ❌ Undetected
 虚拟内存 Swap       : [ no swap partition or swap file detected ]
 硬盘空间            : 1.33 GB / 502.90 GB [0.3%] /dev/vda1 - /
 启动盘路径          : /dev/vda1
 系统                : alpine 3.22.1 [x86_64] 
 内核                : 6.12.40-0-virt
 系统在线时间        : 3 days, 05 hours, 10 minutes
 时区                : CST
 负载                : 0.00 / 0.00 / 0.00
 虚拟化架构          : Dedicated (No visible signage)
 NAT类型             : Full Cone
 TCP加速方式         : cubic
 IPV4 ASN            : AS197540 netcup GmbH
 IPV4 Location       : Nuremberg / Bavaria / Germany
 IPV6 ASN            : AS197540 netcup GmbH
 IPV6 Location       : Nuremberg / Bavaria / Germany
 IPv6 子网掩码       : /64
--------------------------------CPU测试-通过sysbench测试--------------------------------
1 线程测试(单核)得分: 3712.32
4 线程测试(多核)得分: 14975.53
--------------------------------内存测试-通过sysbench测试---------------------------------
内存复制速度(读+写) (MEMCPY)   :   14610.95 MB/s 
内存复制速度(读+写) (DUMB)     :   10143.90 MB/s 
内存复制速度(读+写) (MCBLOCK)  :   12992.78 MB/s 
-----------------------------------硬盘测试-通过fio测试-----------------------------------
测试路径      块大小   读测试(IOPS)            写测试(IOPS)            总和(IOPS)
/root         4k       180.99 MB/s(45.2k)      181.47 MB/s(45.4k)      362.45 MB/s(90.6k)      
/root         64k      460.82 MB/s(7200)       463.24 MB/s(7238)       924.06 MB/s(14.4k)      
/root         512k     405.98 MB/s(792)        427.55 MB/s(835)        833.52 MB/s(1627)       
/root         1m       554.07 MB/s(541)        590.97 MB/s(577)        1.15 GB/s(1118)         
-------------------------------------御三家流媒体解锁-------------------------------------
----------------Netflix-----------------
[IPV4]
您的出口IP完整解锁Netflix，支持非自制剧的观看
NF所识别的IP地域信息：德国
[IPV6]
您的出口IP完整解锁Netflix，支持非自制剧的观看
NF所识别的IP地域信息：德国
----------------Youtube-----------------
[IPV4]
连接方式: Youtube Video Server
视频缓存节点地域: 德国法兰克福(FRA16S31)
[IPV6]
连接方式: Google Global CacheCDN (ISP Cooperation)
ISP运营商: ANEXIAAT
视频缓存节点地域: 奥地利维也纳(VIE1)
---------------DisneyPlus---------------
[IPV4]
当前IPv4出口所在地区即将开通DisneyPlus
[IPV6]
当前IPv4出口所在地区即将开通DisneyPlus
-------------------------------------跨国流媒体解锁--------------------------------------
IPV4:
============[ 跨国平台 ]============
Apple                     YES (Region: DEU) [Native]
BingSearch                YES (Region: DE)
Claude                    YES [Native]
Dazn                      YES (Region: DE) [Native]
Disney+                   YES (Region: DE) [Native]
Gemini                    NO
GoogleSearch              YES
Google Play Store         YES (Region: DE) [Native]
IQiYi                     YES (Region: DE) [Native]
Instagram Licensed Audio  YES [Native]
KOCOWA                    YES [Native]
MetaAI                    NO (GeoBlocked)
Netflix                   YES (Region: US) [Native]
Netflix CDN               AT
OneTrust                  YES (Region: DE BAVARIA) [Via DNS]
ChatGPT                   YES (Region: DE) [Native]
Paramount+                YES [Native]
Amazon Prime Video        YES (Region: DE) [Native]
Reddit                    YES
SonyLiv                   YES (Region: DE) [Native]
Sora                      YES (Region: DE)
Spotify Registration      YES (Region: DE) [Native]
Steam Store               YES (Community Available) (Region: DE)
TVBAnywhere+              YES (Region: DE) [Native]
TikTok                    YES (Region: DE) [Native]
Viu.com                   YES [Native]
Wikipedia Editability     YES
YouTube Region            YES (Region: DE) [Native]
YouTube CDN               FRA
--------------------------------------IP质量检测--------------------------------------
以下为各数据库编号，输出结果后将自带数据库来源对应的编号
ipinfo数据库  [0] | scamalytics数据库 [1] | virustotal数据库   [2] | abuseipdb数据库   [3] | ip2location数据库    [4]
ip-api数据库  [5] | ipwhois数据库     [6] | ipregistry数据库   [7] | ipdata数据库      [8] | db-ip数据库          [9]
ipapiis数据库 [A] | ipapicom数据库    [B] | bigdatacloud数据库 [C] | dkly数据库        [D] | ipqualityscore数据库 [E]
IPV4:
安全得分:
声誉(越高越好): 0 [2] 
信任得分(越高越好): 0 [8] 
VPN得分(越低越好): 100 [8] 
代理得分(越低越好): 100 [8] 
社区投票-无害: 0 [2]
社区投票-恶意: 0 [2] 
威胁得分(越低越好): 99 [8] 
欺诈得分(越低越好): 14 [1] 84 [E]
滥用得分(越低越好): 0 [3] 
ASN滥用得分(越低越好): 0.0054 (Low) [A] 
公司滥用得分(越低越好): 0.0215 (Elevated) [A] 
威胁级别: low [9] 
黑名单记录统计:(有多少黑名单网站有记录):
无害记录数: 0 [2]  恶意记录数: 0 [2]  可疑记录数: 0 [2]  无记录数: 94 [2]  
安全信息:
使用类型: DataCenter/WebHosting/Transit [3] hosting [0 7 9 A] hosting - high probability [C] business [8]
公司类型: hosting [0 7 A] 
是否云提供商: Yes [7] 
是否数据中心: No [8] Yes [0 1 5 6 A C]
是否移动设备: Yes [E] No [5 A C]
是否代理: No [0 1 4 5 6 7 8 9 A C] Yes [E]
是否VPN: Yes [A E] No [0 1 6 7 C]
是否Tor: No [0 1 3 6 7 8 A C E] 
是否Tor出口: No [1 7] 
是否网络爬虫: No [9 A E] 
是否匿名: Yes [8] No [1 6 7]
是否攻击者: No [7 8] 
是否滥用者: No [7 8 A C] Yes [E]
是否威胁: No [7 8 C] 
是否中继: No [0 7 8 C] 
是否Bogon: No [7 8 A C] 
是否机器人: Yes [E] 
DNS-黑名单: 314(Total_Check) 0(Clean) 5(Blacklisted) 15(Other) 
IPV6:
安全得分:
欺诈得分(越低越好): 14 [1] 
滥用得分(越低越好): 0 [3]
ASN滥用得分(越低越好): 0.0054 (Low) [A] 
公司滥用得分(越低越好): 0 (Very Low) [A] 
安全信息:
使用类型: DataCenter/WebHosting/Transit [3] hosting [A]
公司类型: hosting [A] 
是否数据中心: Yes [1 A]
是否移动设备: No [A] 
是否代理: No [1 A] 
是否VPN: No [1 A] 
是否TorExit: No [1] 
是否Tor出口: No [1] 
是否网络爬虫: No [A] 
是否匿名: No [1] 
是否滥用者: No [A] 
是否Bogon: No [A] 
DNS-黑名单: 314(Total_Check) 0(Clean) 0(Blacklisted) 314(Other) 
--------------------------------------邮件端口检测--------------------------------------
Platform  SMTP  SMTPS POP3  POP3S IMAP  IMAPS
LocalPort ✔     ✔     ✔     ✔     ✔     ✔    
QQ        ✔     ✔     ✔     ✘     ✔     ✘    
163       ✔     ✔     ✔     ✘     ✔     ✘    
Sohu      ✔     ✔     ✔     ✘     ✔     ✘    
Yandex    ✔     ✔     ✔     ✘     ✔     ✘    
Gmail     ✔     ✔     ✘     ✘     ✘     ✘    
Outlook   ✔     ✘     ✔     ✘     ✔     ✘    
Office365 ✔     ✘     ✔     ✘     ✔     ✘    
Yahoo     ✔     ✔     ✘     ✘     ✘     ✘    
MailCOM   ✔     ✔     ✔     ✘     ✔     ✘    
MailRU    ✔     ✔     ✘     ✘     ✔     ✘    
AOL       ✔     ✔     ✘     ✘     ✘     ✘    
GMX       ✔     ✔     ✔     ✘     ✔     ✘    
Sina      ✔     ✔     ✔     ✘     ✔     ✘    
Apple     ✘     ✔     ✘     ✘     ✘     ✘    
FastMail  ✘     ✔     ✘     ✘     ✘     ✘    
ProtonMail✘     ✘     ✘     ✘     ✘     ✘    
MXRoute   ✔     ✘     ✔     ✘     ✔     ✘    
Namecrane ✔     ✔     ✔     ✘     ✔     ✘    
XYAMail   ✘     ✘     ✘     ✘     ✘     ✘    
ZohoMail  ✘     ✔     ✘     ✘     ✘     ✘    
Inbox_eu  ✔     ✔     ✔     ✘     ✘     ✘    
Free_fr   ✘     ✔     ✔     ✘     ✔     ✘    
-------------------------------------三网回程线路检测-------------------------------------
北京电信v4 219.141.140.10           电信163    [普通线路] 
北京联通v4 202.106.195.68           联通4837   [普通线路] 
北京移动v4 221.179.155.161          移动CMI    [普通线路] 移动CMIN2  [精品线路] 
上海电信v4 202.96.209.133           电信163    [普通线路] 
上海联通v4 210.22.97.1              联通4837   [普通线路] 
上海移动v4 211.136.112.200          移动CMI    [普通线路] 移动CMIN2  [精品线路] 
广州电信v4 58.60.188.222            电信163    [普通线路] 
广州联通v4 210.21.196.6             联通4837   [普通线路] 
广州移动v4 120.196.165.24           移动CMI    [普通线路] 
成都电信v4 61.139.2.69              电信163    [普通线路] 
成都联通v4 119.6.6.6                联通4837   [普通线路] 
成都移动v4 211.137.96.205           移动CMI    [普通线路] 
北京电信v6 2400:89c0:1053:3::69     电信163    [普通线路] 
北京联通v6 2400:89c0:1013:3::54     联通4837   [普通线路] 
北京移动v6 2409:8c00:8421:1303::55  移动CMIN2  [精品线路] 移动CMI    [普通线路] 
上海电信v6 240e:e1:aa00:4000::24    电信163    [普通线路] 
上海联通v6 2408:80f1:21:5003::a     联通4837   [普通线路] 
上海移动v6 2409:8c1e:75b0:3003::26  移动CMIN2  [精品线路] 移动CMI    [普通线路] 
广州电信v6 240e:97c:2f:3000::44     电信163    [普通线路] 
广州联通v6 2408:8756:f50:1001::c    联通4837   [普通线路] 
广州移动v6 2409:8c54:871:1001::12   移动CMIN2  [精品线路] 移动CMI    [普通线路] 
-------------------------------------三网回程路由检测-------------------------------------
广州电信 - ICMP v4 - traceroute to 58.60.188.222, 30 hops max, 52 byte packets
0.48 ms      AS197540                      德国, 巴伐利亚州, 纽伦堡, netcup.de 
1.35 ms      AS47147                       德国, 黑森, 美茵河畔法兰克福, anexia.com 
12.11 ms     AS9002                        德国, 巴伐利亚, 纽伦堡, retn.net 
8.66 ms      AS9002                        德国, 黑森, 美因河畔法兰克福, retn.net 
5.79 ms      AS9002                        德国, 黑森, 美茵河畔法兰克福, retn.net 
207.31 ms    AS4134     [CHINANET-BB]      中国, 广东, 广州, www.chinatelecom.com.cn  电信
208.80 ms    AS4134     [CHINANET-BB]      中国, 广东, 广州, www.chinatelecom.com.cn  电信
*
213.88 ms    AS134774   [CHINANET-GD]      中国, 广东, 深圳, chinatelecom.cn  电信
*
广州联通 - ICMP v4 - traceroute to 210.21.196.6, 30 hops max, 52 byte packets
0.53 ms      AS197540                      德国, 巴伐利亚州, 纽伦堡, netcup.de 
50.92 ms     AS47147                       德国, 黑森, 美茵河畔法兰克福, anexia.com 
0.55 ms      AS1299     [TELIANET]         德国, 巴伐利亚, 纽伦堡, arelion.com 
3.96 ms      AS1299     [ARELION-NET]      德国, 黑森州, 美因河畔法兰克福, arelion.com 
*
4.05 ms      AS4837     [CU169-BACKBONE]   德国, 黑森, 美因河畔法兰克福, chinaunicom.cn  联通
173.90 ms    AS4837     [CU169-BACKBONE]   中国, 广东, 广州, chinaunicom.cn 
229.31 ms    AS4837     [CU169-BACKBONE]   中国, 广东, 广州, chinaunicom.cn  联通
*
233.40 ms    AS17816    [APNIC-AP]         中国, 广东, 茂名市, chinaunicom.cn  联通
193.90 ms    AS17623    [APNIC-AP]         中国, 广东, 深圳, chinaunicom.cn  联通
231.20 ms    AS17623                       中国, 广东, 深圳, chinaunicom.cn  联通
广州移动 - ICMP v4 - traceroute to 120.196.165.24, 30 hops max, 52 byte packets
11.87 ms     AS197540                      德国, 巴伐利亚州, 纽伦堡, netcup.de 
1.56 ms      AS47147                       德国, 黑森, 美茵河畔法兰克福, anexia.com 
0.50 ms      AS1299     [TELIANET]         德国, 巴伐利亚, 纽伦堡, arelion.com 
4.15 ms      AS1299     [ARELION-NET]      德国, 黑森州, 美因河畔法兰克福, arelion.com 
4.31 ms      AS1299     [ARELION-NET]      德国, 黑森州, 美因河畔法兰克福, arelion.com 
6.35 ms      AS1299     [ARELION-NET]      德国, 黑森州, 美因河畔法兰克福, arelion.com 
11.47 ms     AS1299     [ARELION-NET]      德国, 黑森, 美因河畔法兰克福, arelion.com 
4.94 ms      AS58453    [CMI-INT]          德国, 黑森, 美茵河畔法兰克福, cmi.chinamobile.com  移动
201.52 ms    AS58453    [CMI-INT]          中国, 香港, cmi.chinamobile.com  移动
208.91 ms    AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
210.60 ms    AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
*
218.46 ms    AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
215.75 ms    AS9808     [CMNET]            中国, 广东, 广州, chinamobileltd.com  移动
213.24 ms    AS56040    [APNIC-AP]         中国, 广东, 深圳, gd.10086.cn  移动
--------------------------------------就近节点测速--------------------------------------
位置            上传速度        下载速度        延迟            丢包率          
Speedtest.net   853.70 Mbps     976.62 Mbps     467.868µs       0.50% (Sent: 400/Dup: 0/Max: 401)
法兰克福        892.12 Mbps     910.54 Mbps     4.310128ms      N/A             
洛杉矶          232.52 Mbps     493.85 Mbps     153.504843ms    N/A             
电信浙江        120.46 Mbps     167.22 Mbps     169.990761ms    N/A             
电信浙江        24.73 Mbps      13.25 Mbps      186.686163ms    N/A             
移动Suzhou      5.46 Mbps       0.43 Mbps       693.310153ms    N/A             
----------------------------------------------------------------------------------
花费          : 7 分 41 秒
时间          : Thu Jul 31 01:46:00 CST 2025
----------------------------------------------------------------------------------
```