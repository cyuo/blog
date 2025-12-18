---
title: 2025 牛客寒假算法基础集训营 1 个人题解
published: 2025-01-21 20:57:00
description: ''
image: ''
tags: [sort, greedy, trisection, math, data structure, simulate]
category: '算法竞赛'
draft: false 
lang: ''
---
这场一道 DP 都没有，思维题为主，很神奇。

## A 茕茕孑立之影

显然最小的大于 $10^9$ 的质数 $1000000007$ 一定是一个合法解，仅在存在 $a_i=1$ 时无解。

~~如果读到 1 不要直接输出 -1，要先把数据读完。作者被这个坑了 10 分钟。~~

## B 一气贯通之刃

图是链，答案是链的头尾，否则无解。

## D 双生双宿之决

按题意用 `map` 计数即可，`size != 2` 都不符合题意，也要输出 `-1`。

## G 井然有序之衡

先求和 $a$，如果 $sum \not= {n(n+1) \over2}$，那么无法得到目标排列，否则答案是
$$
\sum_{i=1}^{n}|a_i-i|
$$

## H 井然有序之窗

### 蒟蒻作者麻烦的写法

作者的做法比较麻烦。考虑优先让可以选的数少的位置选。选择时先选择前面没选到的，**被需要次数少**的数（就是被前面给定的区间包含的次数）。使用线段树来选择。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
#define inf array<int,2>{1000000,-1}
using namespace std;

struct node{
	node *ls,*rs;
	array<int,2> x;
	void pull(){
		x=min(ls->x,rs->x);
	}
};
node *root,*p;

vector pre(0,0);

void assign(node *x,int l,int r,int p){
	if(l==r){
		x->x=inf;
		return;
	}
	int m=l+r>>1;
	if(p<=m) assign(x->ls,l,m,p);
	else assign(x->rs,m+1,r,p);
	x->pull();
};

void build(node *x,int l,int r){
	if(l==r){
		x->x={pre[l],l};
		return;
	}
	int mid=(l+r)/2;
	x->ls=++p;
	x->rs=++p;
	build(x->rs,mid+1,r);
	build(x->ls,l,mid);
	x->pull();
};

array<int,2> query(node *x,int l,int r,int ql,int qr){
	if (ql<=l and r<=qr){
		return x->x;
	}
	int mid=l+r>>1;
	auto ret=inf;
	if (ql<=mid){
		ret=min(ret,query(x->ls,l,mid,ql,qr));
	} 
	if (qr>mid){
		ret=min(ret,query(x->rs,mid+1,r,ql,qr));
	} 
	return ret;
}

void solve(){
	int n;
	cin>>n;
	vector<array<int,4>>a(n);
	pre=vector(n+2,0);
	{
		int cnt=0;
		for(auto&&[x,l,r,p]:a){
			cin>>l>>r;
			pre[l]++;
			pre[r+1]--;
			x=r-l+1;
			p=++cnt;
		}
		sort(a.begin(),a.end());
	}
	up(i,1,n){
		pre[i]+=pre[i-1];
	}
	vector<node> t(n<<2);
	root=&t[0],p=&t[0];
	build(root,1,n);
	vector ans(n+1,0);
	for(auto&&[x,l,r,p]:a){
		auto res=query(root,1,n,l,r);
		if(res[1]==-1){
			cout<<-1;
			return;
		}
		ans[p]=res[1];
		assign(root,1,n,res[1]);
	}
	up(i,1,n){
		cout<<ans[i]<<" ";
	}
}
int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	int T=1;
	// cin>>T;
	while(T--)solve();
}
```

### 标程

~~作者说这是一道非常典的题。~~

对于每个 $j$，选择填入在满足 $l_i\le j \le r_i$ 的所有 $i$ 中 $r_i$ 最小的 $i$。使用优先队列维护。

如果在选择的时候发现 $j$ 已经超出某组队列中的 $(l_i,r_i)$ ，那么无解（意味着 $a_i$ 没有数可以填入了）。没得选同样无解。

`priority_queue` 默认大顶堆。`ranges::sort` 是 C++20 引入的（牛客居然支持那么新的标准）。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;

void solve(){
	int n;
	cin>>n;
	vector<array<int,3>>a(n);
	{
		int _=0;
		for (auto&&[l,r,i]:a){
			cin>>l>>r;
			i=++_;
		}
	}
	ranges::sort(a);
	vector ans(n+1,0);
	priority_queue<array<int,3>,vector<array<int,3>>,greater<array<int,3>>>q;
	auto it=a.begin();
	up(i,1,n){
		while(it!=a.end() and (*it)[0]<=i){
			auto &&[l,r,p]=*it;
			// cout<<l<<" "<<r<<" "<<p<<endl;
			q.push({r,l,p});
			it++;
		}
		if (q.empty()){
			cout<<"-1\n";
			return;
		}
		auto [r,l,j]=q.top();
		q.pop();
		if (r<i){
			cout<<"-1\n";
			return;
		}
		ans[j]=i;
	}
	up(i,1,n) cout<<ans[i]<<" \n"[i==n];
}

int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	int T=1;
	// cin>>T;
	while(T--)solve();
}
```

## J 硝基甲苯之袭

预处理每个数除 1 以外的约数。然后枚举每个 $a_i$ 的约数 $x$，如果 $\gcd(a_i,a_i\oplus x)=x$，那么 $a_i \oplus x$ 显然就是一个合法的 $a_j$。$a_i$ 范围很小，使用 `cnt` 记录数据出现次数即可。

特别的，对于 $a_i \oplus a_j=\gcd(a_i,a_j)=1$，显然只有 $a_i = a_j +1$ 时才会出现。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;

const int mx=200000;
vector<vector<int>>z(mx+5);

void solve(){
	int n;
	cin>>n;
	vector<int>cnt(mx+5);
	ll ans=0;
	for(int idx=0;idx<n;idx++){
		int i;
		cin>>i;
		cnt[i]++;
		if (cnt[i+1] and (i^(i+1))==1)ans+=cnt[i+1];
		if (i>1 and cnt[i-1] and (i^(i-1))==1)ans+=cnt[i-1];
		for (auto&&j:z[i]){
			if ((i^j)<=mx and gcd(i^j,i)==j)ans+=cnt[i^j];
		}
	}
	cout<<ans<<"\n";
}

int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	up(i,2,mx){
		for (int j=i;j<=mx;j+=i){
			if (i^j<=mx) z[j].push_back(i);
		}
	}
	int T=1;
	while(T--)solve();
}
```

## M 数值膨胀之美 

从最小的数开始 `*2`，直到所有数都被 `*2`。每次将区间扩展到当前最小数的位置。时间复杂度 $O(n\log n)$。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;

void solve(){
	int n;
	cin>>n;
	vector<array<int,2>>a(n+2);
	a[n+1]={2000000000,0};
	vector<int>b(n+1);
	up(i,1,n){
		cin>>b[i];
		a[i]={b[i],i};
	}
	sort(a.begin()+1,a.end());
	int l=a[1][1],r=l;
	int mx=max(a[1][0]*2,a[n][0]);
	int res=mx-min(a[1][0]*2,a[2][0]);
	up(i,2,n){
		while(a[i][1]<l){
			l--;
			mx=max(mx,b[l]*2);
		}
		while(a[i][1]>r){
			r++;
			mx=max(mx,b[r]*2);
		}
		res=min(res,mx-min(a[1][0]*2,a[i+1][0]));
	}
	cout<<res;
}

int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	int T=1;
	// cin>>T;
	while(T--)solve();
}
```

## E 双生双宿之错

这道题三分可以做，但作者的三分一直 80 分，不知道什么原因，非常可惜。

结论是，如果我们想要让整个数组变成同一个数的，同时代价最小，选中位数就行。

变成两个数时，排序，前后分别取中位数即可。代价是
$$
\sum_{i=1}^{n}|a_i-a_{mid}|
$$
两部分代价相加就是所求答案。

绝对值可以用前缀和 + 二分优化，比如你要求 $\sum_{i=l}^{r}|a_i-x|$，你可以

```c++
auto calc=[&](ll l,ll r,ll x)->ll{
	ll p=lower_bound(a.begin()+l,a.begin()+r+1,x)-a.begin();
	return x*(p-1-l+1)-(pre[p-1]-pre[l-1])+(suf[p]-suf[r+1])-x*(r-p+1);
};
```

这样时间复杂度就是 $O(\log n)$，但我看标程就是暴力直接求了，我也懒得重新写了。

~~哭死，我的版本反而只有 80 分。~~

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;

void solve(){
	int n;
	cin>>n;
	vector a(n+1,0);
	up(i,1,n) cin>>a[i];
	ranges::sort(a);
	int mid=n>>1;
	auto get=[&](int l,int r){
		ll res=0;
		up(i,1,mid) res+=abs(a[i]-l);
		up(i,mid+1,n) res+=abs(a[i]-r);
		return res;
	};
	auto f=[&](int x,int y){
		return a[x]!=a[y] ? get(a[x],a[y]) : min(get(a[x]-1,a[y]),get(a[x],a[y]+1));
	};
	
	int x=(mid+(mid&1))/2;
	int y=mid+x+((mid&1)^1);
	cout<<f(x,y)<<"\n";
}

int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	int T=1;
	cin>>T;
	while(T--)solve();
}
```

## C 兢兢业业之移

其实是暴力模拟题，但作者的暴力思路有问题，没过。

暴力思路就是先把所有 1 往上推，再往左推，这样 1 聚集在左上角呈类似三角形。再把超出范围的 1 推到范围内。

怎么把 1 推到范围内？不难发现，最外面的 1 一定是上、左、下不能走（边缘和 1 视为不能走，11 交换没用），或者上、左不能走。那么当这个 1 的坐标在目标范围且满足上左不能走的条件的时候，我们判断走到目标位置了就行。显然，最初 $y > {n\over 2}$ 的 1 只需要往右、上走，$x > {n\over 2}$ 的 1 则往左、下走。不可能存在同时满足这两个条件的 1。