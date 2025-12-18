---
title: 【赛时 AK】LeetCode 周赛 469 题解
published: 2025-09-28
description: ''
image: ''
tags: [xcpc]
category: '算法竞赛'
draft: false 
lang: ''
---

## 1. [计算十进制表示](https://leetcode.cn/problems/compute-decimal-representation/)

### 解题思路
将整数 n 分解为其各位数字与其对应位值的乘积，忽略值为 0 的位。从低位到高位处理，使用变量 cur 记录当前位值（1, 10, 100, ...）。将非零数字与位值相乘的结果存入数组，最后反转数组得到从高位到低位的顺序。

### 代码实现
```cpp
class Solution {
public:
    vector<int> decimalRepresentation(int n) {
        vector<int> ret;
        int cur = 1;
        while (n) {
            if (n % 10) {
                ret.push_back(n % 10 * cur);
            }
            n /= 10;
            if (cur < 1000000000) cur *= 10;
        }
        ranges::reverse(ret);
        return ret;
    }
};
```

### 复杂度分析
- 时间复杂度：O(log₁₀ n)，取决于数字的位数。
- 空间复杂度：O(log₁₀ n)，存储结果的数组大小。

## 2. [分割数组得到最小绝对差](https://leetcode.cn/problems/split-array-with-minimum-difference/)

### 解题思路
要求将数组分成两个非空连续子数组，使得两个子数组和的差的绝对值最小，且第一个子数组严格递增，第二个子数组严格递减。

首先从右往左找到第一个不满足严格递减的位置 l（即 nums[l] >= nums[l-1]），则第二个子数组至少要从 l 开始。

然后从左往右枚举第一个子数组的结束位置 i：
- 若 nums[i] <= nums[i-1]，则第一个子数组不再严格递增，终止枚举。
- 若 i >= l，则满足第二个子数组严格递减的条件，计算当前分割的差值，更新答案。

### 代码实现
```cpp
class Solution {
public:
    long long splitArray(vector<int>& nums) {
        int n = nums.size();
        int l = n - 1;
        for (; l > 0; l--) {
            if (nums[l] >= nums[l - 1]) {
                l--;
                break;
            }
        }
        long long ans = LLONG_MAX;
        long long cur = 0, sum = accumulate(nums.begin(), nums.end(), 0ll);
        for (int i = 0; i < n; i++) {
            if (i && nums[i] <= nums[i - 1]) {
                break;
            }
            cur += nums[i];
            if (i >= l) {
                ans = min(ans, abs(cur - (sum - cur)));
            }
        }
        if (ans == LLONG_MAX) return -1;
        else return ans;
    }
};
```

### 复杂度分析
- 时间复杂度：O(n)，遍历数组两次。
- 空间复杂度：O(1)，仅使用常数额外空间。

## 3. [ZigZag 数组的总数 I](https://leetcode.cn/problems/number-of-zigzag-arrays-i/)

### 解题思路
动态规划。定义 dp[i][j][0] 表示长度为 i、以值 j 结尾且最后两个元素是上升（j 比前一个元素大）的 ZigZag 数组数量；dp[i][j][1] 表示最后两个元素是下降的。

转移方程：
- dp[i][j][0] = sum(dp[i-1][k][1])，其中 k < j，即前一个元素比 j 小且是下降的。
- dp[i][j][1] = sum(dp[i-1][k][0])，其中 k > j，即前一个元素比 j 大且是上升的。

使用前缀和优化转移，将复杂度从 O(n * r²) 降为 O(n * r)。

### 代码实现
```cpp
template<typename T = long long, int mod = 998244353>
struct Mint {
    // 模数运算实现（略）
};

using Z = Mint<long long, 1000000007>;
Z dp[2001][2001][2];

class Solution {
public:
    int zigZagArrays(int n, int l, int r) {
        // 初始化长度为1的数组
        for (int i = l; i <= r; i++) {
            dp[1][i][0] = dp[1][i][1] = 1;
        }
        // 动态规划
        for (int i = 2; i <= n; i++) {
            for (int j = l; j <= r; j++) dp[i][j][0] = dp[i][j][1] = 0;
            // 计算 dp[i][j][1]：上升转下降
            Z cur = dp[i - 1][l][0];
            for (int j = l + 1; j <= r; j++) {
                dp[i][j][1] += cur;
                cur += dp[i - 1][j][0];
            }
            // 计算 dp[i][j][0]：下降转上升
            cur = dp[i - 1][r][1];
            for (int j = r - 1; j >= l; j--) {
                dp[i][j][0] += cur;
                cur += dp[i - 1][j][1];
            }
        }
        // 统计结果
        Z res = 0;
        for (int i = l; i <= r; i++)
            res += dp[n][i][0] + dp[n][i][1];
        return (int)res;
    }
};
```

### 复杂度分析
- 时间复杂度：O(n * (r - l))，其中 r - l ≤ 2000。
- 空间复杂度：O(n * r)，可优化为 O(r)。

## 4. [ZigZag 数组的总数 II](https://leetcode.cn/problems/number-of-zigzag-arrays-ii/)

### 解题思路
当 n 很大时，需要矩阵快速幂优化 DP。

将 DP 状态表示为向量，转移用矩阵表示。设 U 为上升转下降的转移矩阵（U[i][j] = 1 当 i < j），V 为下降转上升的转移矩阵（V[i][j] = 1 当 i > j）。

则长度为 n 的数组数量为：b * (U*V)^(n/2) * U（若 n 为奇数）或 b * (U*V)^(n/2)（若 n 为偶数），其中 b 是初始向量（全1）。同理考虑以下降开始的情况。

使用矩阵快速幂计算，由于值域 [l, r] 大小 ≤ 75，矩阵维度为 75×75，快速幂复杂度可接受。

### 代码实现
```cpp
template <typename T = long long, int p = 1000000007>
struct matrix {
    // 矩阵实现（略）
};

class Solution {
public:
    int zigZagArrays(int n, int l, int r) {
        l--, r--;
        matrix b = {1, 75, 0ll};  // 初始向量
        for (int i = l; i <= r; i++) b[0][i] = 1;
        
        matrix u = {75, 75, 0ll}, v = {75, 75, 0ll};
        // 构建转移矩阵
        for (int j = l; j <= r; j++) {
            for (int i = l; i < j; i++) u[i][j] = 1;      // 上升转下降
            for (int i = j + 1; i <= r; i++) v[i][j] = 1; // 下降转上升
        }
        
        n--;
        long long ans = 0;
        // 情况1：以上升开始
        matrix w = u * v;
        matrix a = b * w.pow(n / 2);
        if (n & 1) a = a * u;
        for (int i = l; i <= r; i++) ans = (ans + a[0][i]) % 1000000007;
        
        // 情况2：以下降开始
        w = v * u;
        a = b * w.pow(n / 2);
        if (n & 1) a = a * v;
        for (int i = l; i <= r; i++) ans = (ans + a[0][i]) % 1000000007;
        
        return ans;
    }
};
```

### 复杂度分析
- 时间复杂度：O(m³ log n)，其中 m = r - l + 1 ≤ 75，矩阵乘法复杂度 O(m³)，快速幂需要 O(log n) 次乘法。
- 空间复杂度：O(m²)，存储矩阵。