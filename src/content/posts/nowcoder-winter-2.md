---
title: 2025 牛客寒假算法基础集训营 2 个人题解
published: 2025-01-23 21:18:26
description: ''
image: ''
tags: [sort, greedy, math, data structure, simulate, dfs, combination, fenwick, discrete]
category: '算法竞赛'
draft: false 
lang: ''
---
## A 一起奏响历史之音！

签到，判断 `a>=1 and a<=6 and a!=4` 即可。

## B 能去你家蹭口饭吃吗

还是签到，答案为 $sorted(a)_{\lfloor{n\over2}\rfloor}-1$。

## D 字符串里串

正反跑一边，只有当前字母 $s_i$ / $s_{n-i}$ 在后面 / 前面还有出现，答案就可以更新为 $\max(i,ans)$。

## F 一起找神秘的数！

首先理解
$$
a+b=2(a\And b)+(a \oplus b)
$$
$2(a\And b)$ 是**只进位二进制加法**，$a \oplus b$ 是**不进位二进制加法**。

将上面公式代入题目，得到
$$
a|b=a\And b
$$
显然解只有 $a=b$。答案为 $r-l+1$。

## G 一起铸最好的剑！

找到距离 $n$ 最小的两个 $m^x$ ，使之更接近的 $x$ 就是答案。 

罚时吃满，这题要求一定要启动炉子，答案最小为 `1`。所以特判 `n==1 or m==1 : ans=1`

## H 一起画很大的圆！

外接圆半径
$$
R={abc \over4S}
$$
在长边的最左 / 右选一个长度为 1 的线段为三角形一边，剩下部分与短边与长边相邻的长度 1 线段，构成的斜边为三角形第二条边。至此三角形已经确定。

横着可以找到一个答案是 $(a,d−1),(b,d),(b−1,d)$，但如果 $d−c>b−a$ 的话，就应该竖着找。

```c++
void solve(){
	int a,b,c,d;
	cin>>a>>b>>c>>d;
	if (b-a>d-c){
		cout<<a<<" "<<d-1<<"\n";
		cout<<b-1<<" "<<d<<"\n";
		cout<<b<<" "<<d<<"\n";
	}else{
		cout<<a+1<<" "<<c<<"\n";
		cout<<a<<" "<<d-1<<"\n";
		cout<<a<<" "<<d<<"\n";
	}
}
```

## J 数据时间？

Python 秒

```python
from collections import defaultdict
from datetime import datetime
strptime=datetime.strptime

ri=lambda : int(input())
rl=lambda : list(map(int,input().split()))

def solve():
	n,h,m=rl()
	res=[set() for i in range(3)]
	for i in range(n):
		a=input().split()
		d=strptime(a[1]+" "+a[2],f"%Y-%m-%d %H:%M:%S")
		if d.year==h and d.month==m:
			if d.hour>=7 and d.hour<=8 or d.hour==9 and d.minute==0 and d.second==0:
				res[0].add(a[0])
			elif d.hour>=18 and d.hour<=19 or d.hour==20 and d.minute==0 and d.second==0:
				res[0].add(a[0])
			elif d.hour>=11 and d.hour<=12 or d.hour==13 and d.minute==0 and d.second==0:
				res[1].add(a[0])
			elif d.hour>=22 or d.hour==0 or d.hour==1 and d.minute==0 and d.second==0:
				res[2].add(a[0])
	print(len(res[0]),len(res[1]),len(res[2]))
```

## K 可以分开吗？

DFS 板子题之一，遍历所有连通块，找最少的相邻灰块。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(int i=x;i<=y;i++)
#define down(i,x,y) for(int i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;
vector<vector<int>>vis;
vector<array<int,2>>path;
vector<string>tu;
vector<array<int,2>>dt{{-1,0},{0,-1},{0,1},{1,0}};
int n,m;
void dfs(int y,int x){
	path.push_back({y,x});
	vis[y][x]=1;
	for (auto&&[dy,dx]:dt){
		int gy=y+dy,gx=x+dx;
		if (gy>n or gy<1 or gx>m or gx<1 or tu[gy][gx]=='0' or vis[gy][gx]) continue;
		dfs(gy,gx);
	}
}

void solve(){
	cin>>n>>m;
	vis=vector(n+2,vector(m+2,0));
	tu=vector<string>(n+1);
	int mxc=INT_MAX;
	up(i,1,n) {
		cin>>tu[i];
		tu[i]="^"+tu[i];
	}
	up(i,1,n){
		up(j,1,m){
			if (not vis[i][j] and tu[i][j]=='1'){
				path.resize(0);
				dfs(i,j);
				int cnt=0,flg=i*m+j;
				for (auto&&[y,x]:path){
					for (auto&&[dy,dx]:dt){
						int gy=y+dy,gx=x+dx;
						if (gy>n or gy<1 or gx>m or gx<1 or tu[gy][gx]=='1' or vis[gy][gx]==flg) continue;
						vis[gy][gx]=flg;
						cnt++;
					}
                }
				mxc=min(mxc,cnt);
			}
		}
	}
	cout<<mxc<<"\n";
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

## C 字符串外串

构造题。

形如 `"cbaaaabc"` 的构造方法，构造一个长度为 $n$ 的字符串，最后的 $m$ 应该等于 $n$ 减去最后 `"abc..z"` 的长度。显然 `n==m` 时无解，`n-m > 26 or n-m > m+1` 时这种方法无解。

形如 `"cbadefgabc"` 的构造方法，构造一个长度为 $n$ 的字符串，最后的 $m$ 应该等于最后 `"abc..z"` 的长度。显然 `n-2*m>26-m` 的时候这种方法无解。

相结合得到本题答案。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(auto i=x;i<=y;i++)
#define down(i,x,y) for(auto i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;
void solve(){
	int n,m;
	cin>>n>>m;
	if (n<=m or n-m>26 or (n-m>m+1)){
		if (n-2*m>=0 and n-2*m<=26-m){
			cout<<"YES\n";
			up(i,'a',char('a'+m-1)){
				cout<<i;
			}
			up(i,char('a'+m),char('a'+m+(n-m*2)-1)) cout<<i;
			down(i,char('a'+m-1),'a'){
				cout<<i;
			}cout<<"\n";
			return;
		}
		cout<<"NO\n";
		return;
	}
	cout<<"YES\n";
	{
		int gap=n-m;
		char cur='a'+gap-1;
		while(cur>='a'){
			cout<<cur;
			cur--;
		}
		up(i,1,n-gap*2){
			cout<<"a";
		}
		up(i,int(n-m==m+1),gap-1) cout<<char('a'+i);
	}
	cout<<"\n";
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

## E 一起走很长的路！

### 蒟蒻作者的解法（比 std 快！）

贪心的想，增加重量一定不会比减少重量更劣，把重量增加给 $a_l$ 一定不会比后面更劣。

设 $cur$ 为当前增加的重量。

当我们确定 $a_{i}$（$i\not=l$）可行，想要确定接下来的点可不可行，由于 $a_i$ 可行的条件是 $pre_{i-1}-pre_{l-1}+cur\ge a_i$，我们可以确定现在的和一定 $\ge 2a_i$，也就是说我们每次只需要判断下一个大于 $2a_i$ 的 $a_j$ 符不符合条件就行，相当于会一直倍增判断值。显然到一定值以后，后面就不会有更大的值，查询就结束了。这样每次查询时间复杂度就是 $O(\log V)$，题中 $V=10^9$，可以通过这道题。

初始时 $a_l$ 显然一定可以，设置要判断的点 $p=l+1$，运行到 $p>r$ 结束。

怎么找到下一个大于 $2a_i$ 的值？预处理，使用离散化 + 树状数组，倒着跑一遍，记录下一个大于 $a_i$ 的值的下标。预处理时间复杂度 $O(n\log n)$（我的代码是大于等于，导致查询常数稍微大一点）。

整体复杂度 $O(n\log n+q\log V)$。

```c++
#include<bits/stdc++.h>
#define up(i,x,y) for(auto i=x;i<=y;i++)
#define down(i,x,y) for(auto i=x;i>=y;i--)
#define elif else if
#define ll long long
using namespace std;

ll nn;ll n,q;
vector<ll>t;

void assign(ll p,ll x){
	while(p){
		t[p]=min(t[p],x);
		p-=(p&(-p));
	} 
}
ll query(ll p){
	ll res=n+1;
	while(p<=nn){
		res=min(res,t[p]);
		p+=(p&(-p));
	}
	return res;
}

void solve(){
	cin>>n>>q;
	vector<ll>a(n+1),pre(n+1);
	pre[0]=0;
	vector<ll>nxt(n+1,n+1);
	vector<array<ll,2>>b(n+1);
	up(i,1,n){
		cin>>a[i];
		pre[i]=pre[i-1]+a[i];
		b[i]={a[i],i};
	}
	sort(b.begin(),b.end());
	vector<ll>rev(1,0);
	vector<ll>get(n+1);
	{
		ll p=0,last=0;
		for (auto&&[x,i]:b){
			if (x!=last){
				last=x;
				p++;
				rev.push_back(x);
			}
			get[i]=p;
		}nn=p;
	}
	t=vector(nn+1,n+1);
	down(i,n,1){
		int pos=lower_bound(rev.begin(),rev.end(),a[i]*2)-rev.begin();
		nxt[i]=query(pos);
		assign(get[i],i);
	}
	while(q--){
		ll u,v;
		cin>>u>>v;
		if (u==v){
			cout<<"0\n";
			continue;
		}
		ll res=0;
		ll p=u+1;
		while(p<=v){
			if (a[p]>pre[p-1]-pre[u-1]+res){
				res+=a[p]-(pre[p-1]-pre[u-1]+res);
			}
			p=nxt[p];
		}
		cout<<res<<"\n";
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

林林实测标程思维的线段树写法比蒟蒻作者写法慢 6 倍不到。标程 ST 表作者实测也是慢 6 倍左右。

我们在上面说过，贪心的想，增加重量一定不会比减少重量更劣，把重量增加给 $a_l$ 一定不会比后面更劣。

显然，答案就是
$$
\max_{i=l+1}^{r}(a_i-(pre_{i-1}-pre_{l-1}))
$$
如果暴力求 $\max$，时间复杂度就是 $O(n)$。

我们发现（作者考试时没发现 qwq），对于每次查询，$pre_{l-1}$ 是固定的，所以我们求的其实是
$$
\max_{i=l+1}^{r}(a_i-pre_{i-1})+pre_{l-1}
$$
使用 ST 表等处理 RMQ 即可。

作者还没写，先用 [王嘤嘤](https://blog.nowcoder.net/n/bc050acc1dea45878c95816796fbf1b9) 的代码顶上。

```c++
#include<bits/stdc++.h>

using namespace std;

template <typename T>
class ST{
public:
    const int n;
    vector<vector<T>> st;
    ST(int n = 0, vector<T> &a = {}) : n(n){
        st = vector(n + 1, vector<T>(22 + 1));
        build(n, a);
    }

    inline T get(const T &x, const T &y){
        return max(x, y);
    }

    void build(int n, vector<T> &a){
        for(int i = 1; i <= n; i++){
            st[i][0] = a[i];
        }
        for(int j = 1, t = 2; t <= n; j++, t <<= 1){
            for(int i = 1; i <= n; i++){
                if(i + t - 1 > n) break;
                st[i][j] = get(st[i][j - 1], st[i + (t >> 1)][j - 1]);
            }
        }
    }

    inline T find(int l, int r){
        int t = log(r - l + 1) / log(2);
        return get(st[l][t], st[r - (1 << t) + 1][t]);
    }
};

int main(){
    int n, q;
    cin >> n >> q;
    vector f(n + 1, 0ll), d = f;
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        f[i] = f[i - 1] + x;
        d[i] = x - f[i - 1];
    }
    ST<long long> st(n, d);
    while(q--){
        int l, r;
        cin >> l >> r;
        if(l == r){
            cout << 0 << endl;
            continue;
        }
        auto ma = st.find(l + 1, r);
        auto ans = max(ma + f[l - 1], 0ll);
        cout << ans << endl;
    }
}
```
