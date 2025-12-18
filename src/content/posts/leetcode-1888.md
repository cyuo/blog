---
title: 使二进制字符串字符交替的最少反转次数 Leetcode.1888 题解 滑动窗口
published: 2025-01-16 18:45:29
description: ''
image: ''
tags: [sliding window, string, greedy, leetcode]
category: '算法竞赛'
draft: false 
lang: ''
---

Leetcode 的题目一般偏板子，除了难到我的板子题 ~~被板子难到太菜了~~ 我写一下题解。

## 题意

给定一个 01 串 $s$，求通过：

1. 将当前第一项放到末尾。
2. 反转一项。

两种操作让 01 串满足，其任意一项旁边项都与自己相反（$010\dots$，$101\dots$）。求操作 2 最小次数。

## 题解

满足条件的 01 串一定是 $A=010\dots$ 或者 $B=101\dots$ 中的一种，只考虑操作 2 的情况下只需要比较 $s$ 与 $A$ 和 $B$ 的差异，最小差异计数就是答案。

因为操作 1 不影响最终结果，所以操作 1 实际上就是允许我们重新选择环的断点。对于偶数长度的 $s$ ，在哪里断都没有区别。而对于奇数长度的 $s$，我们还需要考虑我们操作 2 可能先让 $s$ 中间出现一处 $\dots0110\dots$，再通过重新断点让其变成符合条件的 01 串。

对于不管哪种情况，我们目标 01 串是下面情况的一种：

* 1 开头，不修改断点
* 0 开头，不修改断点
* 1 开头，0 结尾，修改断点
* 0 开头，1 结尾，修改断点

因而我们可以直接通过前后缀统计差异，再枚举断点，合并为答案，最小的就是我们所求的最小次数。

### 代码

```cpp
class Solution {
public:
    int minFlips(string s) {
        int n=s.length(),ans=n;
        string a="01";
        for (int h=0;h<2;h++){
            vector diff(s.length(),0);
            int cur=0;
            for (int i=0;i<n;i++){
                if (s[i]!=a[h^(i&1)]) cur++;
                diff[i]=cur;
            }
            cur=0;
            int t=h^1;
            for (int i=n-1;i>=0;i--){
                ans=min(ans,diff[i]+cur);
                if (s[i]!=a[t^((n-i-1)&1)])cur++;
            }
        }
        return ans;
    }
};
```