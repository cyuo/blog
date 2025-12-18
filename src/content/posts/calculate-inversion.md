---
title: 逆元的计算 / Python 自带的逆元
published: 2025-01-19 16:07:29
description: ''
image: ''
tags: [inversion, math, python]
category: '算法竞赛'
draft: false 
lang: ''
---
简单来说，逆元就是求 ${1\over a}\bmod p$，其中 $\gcd(a,p)=1$。

形式化的说，我们要求同余方程 $ax\equiv1\pmod p$ 的解。

求解这类问题一般有三种方法：扩展欧几里得、费马小定理、线性算法。

## 费马小定理

当 $\gcd(a,p)=1$ 且 $p$ 为质数时，$x=a^{p-2}$。

对于 C++ 而言，快速幂即可。

```c++
using ll=long long;
ll qpow(ll a,ll b){
    ll res=1;
    while (b){
        if (b&1) res=(res*a)%mod;
        b/=2;
        a=(a*a)%mod;
    }
    return res;
}
ll inv(ll a){
    return qpow(a,mod-2);
}
```

## 扩展欧几里得

```c++
using ll=long long;
tuple<ll,ll> xgcd(ll a,ll b){ // b 是模数
    ll mod=b;
	ll s0=1,s1=0;
	while(b!=0){
		ll q=a/b;
		a-=q*b;
		s0-=q*s1;
		swap(a,b);
		swap(s0,s1);
	}
	return {a,(s0+mod)%mod}; // 最大公约数（在求逆元时一定是 1） 逆元
}
```

## Python 的逆元

Python 的 `pow` 运算符是基于快速幂的，并且其实 `pow` 支持**模数**，所以如果你要求
$$
a^b\bmod p
$$

你可以

```python
pow(a,b,p)
```

那么不难想到，使用费马小定理求逆元在 Python 中可以

```python
pow(a,p-2,p)
```

但其实 `pow` 函数直接支持负数，所以可以直接

```python
pow(a,-1,p)
```

这种 `pow` 也不受 $p$ 为质数这一条件的约束，只需要满足 $\gcd(a,p)=1$ 即可。