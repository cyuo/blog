---
title: 2025 牛客暑期多校训练营 7 个人题解
published: 2025-08-05
description: ''
image: ''
tags: []
category: '算法竞赛'
draft: false 
lang: ''
---

记录一下在比赛中遇到的几道个人认为较有挑战性的题目，分享一下解题思路和过程。

[比赛链接](https://ac.nowcoder.com/acm/contest/108304)。

这场打的稀烂，惨遭队友压力。

## A. Loopy Laggon

### 题目大意

给定一个 n*n 的矩阵，矩阵中的数字 1 到 n^2 恰好各出现一次。你可以对矩阵中任意一个 4x4 的子矩阵进行顺时针或逆时针旋转。问，给定的矩阵是否能通过若干次这样的操作，变回初始有序状态（即第一行是 1,2,...,n，第二行是 n+1,...,2n，以此类推）。

### 题解

这个操作可以看作 12 次交换操作。排列的一次交换会改变逆序对的奇偶性，12 次不会。检查将其展开为一维数组后求逆序对，若为偶数则该矩阵可能可以由无数次旋转操作得到（题目保证 n=10 且允许不超过 10% 错误率）。

```cpp
#include<bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout<<format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
void solve(){
	int id,m,k,n;
	cin>>id>>m>>k>>n;
	string res="";
	vector a(n*n,0);
	upn(_,0,m){
		bool flg=0;
		upn(__,0,k){
			int cur=0;
			upn(i,0,n*n){
				cin>>a[i];
				upn(j,0,i){
					if (a[j]>a[i]) cur++;
				}
			}
			flg|=(cur%2==1);
		}
		if (flg)res.push_back('1');
		else res.push_back('0');
	}
	print("{}",res);
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	cout.tie(nullptr);
	int T=1;
	// cin>>T;
	while(T--) solve();
}
```

## I. Lava Layer

### 题目大意

给定一个包含 k 个个位数的集合 D。首先，随机生成一个长度为 n 的数列 a，其中每个元素 a[i] 都等概率地从集合 D 中选取。然后，在 n−1 个空隙中，等概率地填入 加，乘，与，或，异或 这五种运算符中的一种。请求出最终表达式结果的期望值，答案对 998244353 取模。

### 题解

这是典型的动态规划（DP）求期望问题，并且由于 n 的范围很大（可达 10^18），需要使用矩阵快速幂进行优化。

可以用 dp 解决这道题。以期望值的低 4bit 为键，维护 期望值*概率 与 概率。这样可以同时维护 加乘 操作与二进制位运算操作（D 中的数都小于 2^4）。

```cpp
#include<bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout<<format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
const ll mod=998244353;
template <typename T=long long>
T qpow(T a,T b){
    T res={1};
    while(b){
        if (b&1) res=res*a%mod;
        a=a*a%mod;
        b>>=1;
    }
    return res;
}
template <typename T=long long>
struct matrix{
	int n;
	vector<vector<T>>a;
	matrix(int _n,T x=0):n(_n),a(n,vector<T>(n,0)){
		upn(i,0,n){
			a[i][i]=x;
		}
	}
	
	vector<T>& operator[] (int i) {return a[i];}
	
	matrix operator * (matrix o){
		matrix ret={n};
		upn(i,0,n){
			upn(k,0,n){
				upn(j,0,n){
					ret[i][j]=(ret[i][j]+a[i][k]*o[k][j])%mod;
				}
			}
		}
		return ret;
	}
};
template <typename T=long long>
matrix<T> qpow(matrix<T> a,ll b){
    matrix<T> res={a.n,1};
    while(b){
        if (b&1) res=res*a;
        a=a*a;
        b>>=1;
    }
    return res;
}
void solve(){
	ll n,k;
	cin>>n>>k;
	ll inv5k=qpow(5ll*k,mod-2),invk=qpow(k,mod-2);;
	vector D(k,0ll);
	for (auto&&i:D)cin>>i;
	
	matrix b={32,0ll};
	// 期望 概率
	upn(i,0,16){
		for (auto&&j:D){
			// +
			b[i][(i+j)%16]=(b[i][(i+j)%16]+inv5k)%mod;
			b[i+16][(i+j)%16]=(b[i+16][(i+j)%16]+j*inv5k)%mod;
			b[i+16][(i+j)%16+16]=(b[i+16][(i+j)%16+16]+inv5k)%mod;
			// *
			b[i][(i*j)%16]=(b[i][(i*j)%16]+j*inv5k)%mod;
			b[i+16][(i*j)%16+16]=(b[i+16][(i*j)%16+16]+inv5k)%mod;
			// &
			b[i+16][(i&j)%16]=(b[i+16][(i&j)%16]+(i&j)*inv5k)%mod;
			b[i+16][(i&j)%16+16]=(b[i+16][(i&j)%16+16]+inv5k)%mod;
			// |
			b[i][(i|j)%16]=(b[i][(i|j)%16]+inv5k)%mod;
			b[i+16][(i|j)%16]=(b[i+16][(i|j)%16]+((i|j)-i)*inv5k)%mod;
			b[i+16][(i|j)%16+16]=(b[i+16][(i|j)%16+16]+inv5k)%mod;
			// ^
			b[i][(i^j)%16]=(b[i][(i^j)%16]+inv5k)%mod;
			b[i+16][(i^j)%16]=(b[i+16][(i^j)%16]+((i^j)-i)*inv5k)%mod;
			b[i+16][(i^j)%16+16]=(b[i+16][(i^j)%16+16]+inv5k)%mod;
		}
	}
	matrix a={32,0ll};
	for (auto&&i:D){
		upn(j,0,32){
			a[j][i]=i*invk%mod;
			a[j][i+16]=invk;
		}
	}
	matrix res=a*qpow(b,n-1);
	ll ans=0;
	upn(i,0,16) ans=(ans+res[0][i])%mod;
	print("{}\n",(ans%mod+mod)%mod);
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	cout.tie(nullptr);
	int T=1;
	cin>>T;
	while(T--) solve();
}
```

## D. Lost Woods

### 题目大意

给定一张 N 个点 M 条边的有向有权图。对于所有从起点 1 到终点 N 的路径（可以有环，路径长度不限），计算路径上所有边权的方差。请求出这个方差的下确界（infimum）。

### 题解

这是一个在图上结合 DP 和数学期望/方差性质的题目。

维护 dp[n+1][n+1][n*20+1]，第一个维度表示走过的边，第二个维度表示当前点，第三个维度表示权值和，值表示平方和的最小值。

因为

$$
D = \mathbb{E}[X^2] - \left( \mathbb{E}[X] \right)^2
$$

我们希望方差 D(X) 小，所以平均数（权值和/边数）相同时，我们肯定希望平方和的期望越小。用 dp 从下往上维护即可。

注意特判环，可以通过无限绕环让方差趋近于环的方差（所以叫下确界）。

```cpp
#include<bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout<<format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
void solve(){
	int n,m;
	cin>>n>>m;
	vector tu(n+1,vector(0,array<int,2>{0,0})),ru=tu;
	vector vis1(n+1,false),visn(n+1,false);
	up(i,1,m){
		int u,v,w;
		cin>>u>>v>>w;
		tu[u].push_back({v,w});
		ru[v].push_back({u,w});
	}
	auto bfs=[&](int st,vector<vector<array<int,2>>>&tu,vector<bool>&vis)->void{
		queue<int>q;
		q.push(st);
		while (not q.empty()){
			int p=q.front();
			q.pop();
			vis[p]=1;
			for (auto&&[to,w]:tu[p]){
				if (vis[to]) continue;
				q.push(to);
                vis[to]=1;
			}
		}
	};
	bfs(1,tu,vis1);
	bfs(n,ru,visn);
	if (not vis1[n]){
		print("-1\n");
		return;
	}
	int mx=n*20+1;
	const int inf=0x3f3f3f3f;
	vector dp(n+1,vector(n+1,vector(mx+1,inf)));
	auto f=[&](int st,int ed){
		up(i,0,n) up(j,0,n) up(k,0,mx) dp[i][j][k]=inf;
		dp[0][st][0]=0;
		double ret=1.0*inf;
		upn(i,0,n){
			up(j,1,n){
				up(k,0,mx){
					if (dp[i][j][k]>=inf) continue;
					for (auto&&[to,w]:tu[j]){
						if (k+w<=mx and dp[i][j][k]+w*w<dp[i+1][to][k+w]) {
							dp[i+1][to][k+w]=dp[i][j][k]+w*w;
							if (to==ed){
								ret=min(ret,((double)dp[i+1][to][k+w])/(i+1)-(((double)(k+w))/(i+1)*(k+w)/(i+1)));
							}
						}
					}
				}
			}
		}
		return ret;
	};
	double ans=f(1,n);
	up(i,1,n) if (vis1[i] and visn[i]) ans=min(ans,f(i,i));
	printf("%.9lf\n",ans);
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	cout.tie(nullptr);
	int T=1;
	// cin>>T;
	while(T--) solve();
}
```