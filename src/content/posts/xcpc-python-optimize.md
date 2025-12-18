---
title: 【转】分享｜算法竞赛中 Python 的优化技巧
published: 2025-10-01
description: ''
image: ''
tags: [xcpc, python]
category: '算法竞赛'
draft: false 
lang: ''
---
## 站长留言

转自 [分享｜算法竞赛中 Python 的优化技巧 - FatalError](https://leetcode.cn/discuss/post/3746464/suan-fa-jing-sai-zhong-python-de-you-hua-ev8o/)。

PyPy 下 STD/IO 效率对比 CPython 高很多。但仍然建议优化。

## 前言

本文旨在介绍在算法竞赛使用 Python 时，在复杂度正确且不变的前提下，通过一些技巧优化程序、缩短运行时间。以下介绍的技巧分为三个维度评价：修改的复杂程度，优化的显著程度，以及实用程度。

值得注意的是，Python 自身性质决定了其无论如何优化，都无法通过数据范围较大、复杂度较高的题目<sup>1</sup>。此外，用 Python 写完代码再额外优化的时间，并不见得比直接用 C++ 快。因此尽管 Python 有一些优秀的语言特性，但如果想从事专业算法竞赛，还是放弃对 Python 的执念、多学一门 C++ 为好。

由于以下原因，本文内容多为经验性、有不够严谨之处：尚不完全明确原理；需要对比实验验证；可能在 CPython/PyPy 以及不同版本的 Python 上表现有差异。错误之处敬请指正。

***

## 读写

**【简单，显著，实用】** 读写是耗时瓶颈之一。在输入行数较多时，使用标准输入 sys.stdin 相较于使用 input 优化明显。

```python
import sys
input = lambda: sys.stdin.readline().rstrip()  # 删除行末换行符
II = lambda: int(input())
LII = lambda: list(map(int, input().split()))
```

**【简单，显著，实用】** 如果还想要避免频繁地读取，还可以一次性读入所有输入到内存。

```python
import sys
it = map(int, sys.stdin.read().split())
II = lambda: next(it)
# 如果输入包含字符串，则可以修改为
# it = iter(sys.stdin.read().split())
# SI = lambda: next(it)
# II = lambda: int(SI())
```

**【简单，不显著，实用】** 同理，避免频繁地输出，还可以把所有结果暂存下来再统一输出。

```python
output = []
for _ in range(n):
    ans = solve()
    output.append(ans)
print(*output, sep='\n')
```

**【复杂】** BufferedReader, BufferedWriter 实现过于麻烦，故未测试。

***

## 数据类型

### int

**【简单，不显著，实用】** 取模优化：

```python
# 修改前
ans = 0
for i in range(n):
    ans = (ans + comb(n, i) * pow(2, i, MOD) % MOD) % MOD

# 修改后
ans = 0
for i in range(n):
    ans += comb(n, i) * pow(2, i, MOD)
ans %= MOD
```

**【简单，不显著，实用】** `float('inf')` 是浮点数，比较运算很慢，所以尽量用大整数。

```python
# 修改前
from math import inf
inf = float('inf')

# 修改后
inf = 1 << 60
dis = [inf] * n
```

### str

**【简单，显著，实用】** 字符串拼接优化：

```python
# 修改前
ans = ''
for s in strs:
    ans += s

# 修改后
ans = ''.join(strs)
```

**【简单，不显著，不实用】** `bytearray` 模拟可变字符串：

```python
# 修改前
t = list(s)
t[0] = 'a'
s = ''.join(t)

# 修改后
t = bytearray(s, encoding='ascii')
t[0] = ord('a')
s = t.decode('ascii')
```

### list

**【简单，不显著，实用】** 使用 enumerate：

```python
# 修改前
for i in range(len(nums)):
    x = nums[i]

# 修改后
for i, x in enumerate(nums):
```

**【简单，不显著，实用】** 提前分配空间：

```python
# 修改前
nums = []
for i in range(n):
    nums.append(i)

# 修改后
nums = [0] * n
for i in range(n):
    nums[i] = i
```

**【简单，显著，实用】** 多维 list 优化：

```python
# 修改前
n, k = 10**5, 20
dp = [[0] * k for _ in range(n)]

# 修改后
n, k = 10**5, 20
dp = [[0] * n for _ in range(k)]
```

**【简单，显著，实用】** 二维转一维：

```python
# 修改前
dp = [[0] * n for _ in range(m)]

# 修改后
dp = [0] * (m*n)
compress = lambda i, j: i*n+j
decompress = lambda k: divmod(k, n)
```

**【复杂，显著，实用】** 链式前向星代替邻接表：

```python
# 修改前
g = [[] for _ in range(n)]
def add_edge(u: int, v: int, w: int):
    g[u].append((v, w))

# 修改后
head = [-1] * n
to = [-1] * m
weight = [0] * m
nxt = [-1] * m
ptr = 0
def add_edge(u: int, v: int, w: int):
    nonlocal ptr
    to[ptr] = v
    weight[ptr] = w
    nxt[ptr] = head[u]
    head[u] = ptr
    ptr += 1
```

**【简单，显著，实用】** `array.array` 替代 `list`：

```python
from array import array
nums = array('i', [0] * n)
```

**【简单，显著，不实用】** 布尔数组用 `bytearray`：

```python
vis = bytearray(bytes(n))
```

**【简单，显著，不实用】** `ctypes` C 数组：

```python
from ctypes import c_int32
rank = (c_int32 * n)()
pa = (c_int32 * n)(*range(n))
```

### tuple

**【简单，不显著，不实用】** 多个 list 替代 tuple：

```python
# 修改前
items = [(w1, v1), (w2, v2), ...]

# 修改后
weights = [w1, w2, ...]
values = [v1, v2, ...]
```

### dict

**【简单，显著，实用】** dict 替换为 list：

```python
# 修改前
g = defaultdict(list)

# 修改后
g = [[] for _ in range(n)]
```

**【简单，不显著，实用】** 遍历 dict 用 `.items()`：

```python
# 修改前
for k in mp:
    v = mp[k]

# 修改后
for k, v in mp.items():
```

**【简单，不显著，不实用】** 清空 dict 直接新建：

```python
mp = {}
```

**【简单，显著，实用】** `defaultdict(int)` 代替 Counter：

```python
from collections import defaultdict
cnt = defaultdict(int)
```

**【简单，不显著，实用】** 避免不必要键插入：

```python
x = mp.get(k, 0)
```

**【简单，显著，实用】** 随机化防哈希冲突：

```python
from random import getrandbits
RD = getrandbits(31)
pos = defaultdict(list)
for i, x in enumerate(nums):
    pos[x ^ RD].append(i)
```

**【简单，显著，实用】** 离散化：

```python
sarr = sorted(set(nums))
mp = {x: i for i, x in enumerate(sarr)}
nums = [mp[x] for x in nums]
```

### deque

**【显著，不实用】** 数组模拟队列更快：

```python
q = [0] * n
head, tail = 0, 1
while head < tail:
    u = q[head]
    head += 1
    for v in g[u]:
        q[tail] = v
        tail += 1
```

***

## 函数

**【简单，不显著，实用】** accumulate 优化：

```python
from itertools import accumulate
pres = list(accumulate(nums, initial=0))
```

**【简单，显著，实用】** 手写 min/max：

```python
fmin = lambda x, y: x if x < y else y
fmax = lambda x, y: x if x > y else y
```

**【简单，显著，实用】** 手写快速幂：

```python
def qpow(x, k):
    res = 1
    while k:
        if k & 1:
            res = res * x % MOD
        x = x * x % MOD
        k >>= 1
    return res
```

**【简单，不显著，实用】** 生成器优化：

```python
s = sum(x**2 for x in range(n))
```

**【简单，显著，不实用】** 避免 `sum(list, [])` 拼接：

```python
longlist = []
for lst in lsts:
    longlist.extend(lst)
```

**【复杂，显著，实用】** 迭代改写递归 DFS：

```python
order = []
parents = [-1] * len(tree)
stk = [root]
while stk:
    u = stk.pop()
    order.append(u)
    for v in g[u]:
        if parents[u] != v:
            parents[v] = u
            stk.append(v)
```

***

## 类

**【复杂，显著，实用】** 数组代替类：

```python
class StaticTrie:
    def __init__(self, lengths):
        lengths += 1
        self.children = [[-1] * lengths for _ in range(26)]
        self.isend = [False] * lengths
        self.cnt = [0] * lengths
        self.ptr = 1
```

**【简单，显著，实用】** `__slots__` 优化：

```python
class DSU:
    __slots__ = 'parent', 'size'
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n
```

***

## 参考

**[1]**  Python performance tips. https://codeforces.com/blog/entry/21851

**[2]**  PyRival. https://github.com/cheran-senthil/PyRival/blob/master/pyrival/misc/bootstrap.py

**[3]**  Python Docs. https://docs.python.org/zh-cn/3.13/reference/datamodel.html#object.__slots

**[4]**  AtCoder Library Python. https://github.com/not522/ac-library-python