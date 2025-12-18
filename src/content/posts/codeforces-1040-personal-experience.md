---
title: 第一次参与 Div.1（Codeforces Round 1040）
published: 2025-08-01
description: ''
image: ''
tags: [codeforces]
category: '算法竞赛'
draft: false 
lang: ''
---

CF 偶遇 Div.1，C 题交互强如怪物，拼劲全力无法战胜。

~~打游戏导致第一次 Div.1 迟到 5 分钟。~~

最后 3 题尾，表现分也是只有 1700 了。

## 个人题解

### A. [Double Perspective](https://codeforces.com/contest/2129/problem/A)

加入一条边 \(u \to v\) 能成环证明 \([u,v]\) 内所有点都被覆盖过了，这条边不加也无所谓，因此

$$
\max\{f(s)-g(s)\} = \max\{f(s)\}
$$

因此只要不成环，贪心的想，其他边都选肯定不会更劣。判断是否成环用并查集。

```cpp
#include <bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout << format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
struct dsu {
    int tot;
    vector<int> pa, size;
    dsu(int n) : pa(n+1), size(n+1, 1), tot(n) {
        iota(pa.begin(),pa.end(),0);
        size[0]=0;
    }
    
    int find(int x) { return pa[x]==x? x : pa[x]=find(pa[x]) ;}
    int operator[](int x) {return find(x);}
    
    void unite(int x, int y) {
        x=find(x),y=find(y);
        if (x==y) return;
        tot--;
        if (size[x]<size[y]) swap(x,y);
        pa[y]=x;
        size[x]+=size[y];
    }
};
void solve(){
    int n;
    cin>>n;
    dsu t={2*n};
    vector ans(0,0);
    ans.reserve(n);
    up(i,1,n) {
        int u,v;
        cin>>u>>v;
        if (t[u]==t[v]) continue;
        else{
            ans.push_back(i);
            t.unite(u,v);
        }
    }
    print("{}\n",ans.size());
    for (auto&&i:ans) print("{} ",i);
    print("\n");
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

### B. [Stay or Mirror](https://codeforces.com/contest/2129/problem/B)

也是贪心。只要对这一位执行操作会导致逆序对减少，那么就执行这个操作，用树状数组计算前后逆序对变化。

```cpp
#include <bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout << format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
template<typename T=int>
struct fenwick {
    int n;
    vector<T> t;
    fenwick(int _n): n(_n), t(_n+1){}
    
    T query(int p){
        T res=T{};
        while(p){
            res+=t[p];
            p-=(p&(-p));
        }
        return res;
    }
    T operator[](int p){
        return query(p);
    }
    T operator()(int l,int r){
        if (l>r) swap(l,r);
        return query(r)-query(l-1);
    }
    
    void add(int p,T x){
        while(p<=n){
            t[p]+=x;
            p+=(p&(-p));
        }
    }
};
void solve(){
    int n;
    cin>>n;
    vector a(n+1,0);
    fenwick l={2*n+1},r={2*n+1};
    int base=0;
    up(i,1,n){
        cin>>a[i];
        base+=r[2*n]-r[a[i]];
        r.add(a[i],1);
    }
    int ans=base;
    up(i,1,n){
        r.add(a[i],-1);
        int cur=l[2*n]-l[a[i]]+r[a[i]-1];
        int nxt=l[2*n]-l[2*n-a[i]]+r[2*n-a[i]-1];
        if (nxt<=cur){
            a[i]=2*n-a[i];
            ans+=nxt-cur;
        }
        l.add(a[i],1);
    }
    print("{}\n",ans);
    
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

### C1. [Interactive RBS (Easy Version)](https://codeforces.com/contest/2129/problem/C1)

利用二分答案找到一个左括号和右括号，构造如下括号序列，可以保证不论填入的两个括号长什么样，输出都不一样，可以在 \(n/2 + \log n\) 次内结束，符合题目要求。

```text
()**))
  s   f(x)
()())) 3
()(()) 4
())))) 1
())()) 2
  xx
```

```cpp
#include <bits/stdc++.h>
// #ifdef LOCAL_GCC
#define print cout << format
// #endif
#define up(i,x,y) for (auto i=x;i<=y;i++)
#define upn(i,x,y) for (auto i=x;i<y;i++)
#define down(i,x,y) for (auto i=x;i>=y;i--)
#define elif else if
using ll=long long;
using namespace std;
void solve(){
    int n;
    cin>>n;
    vector<char>res(n+1);
    int cl=-1,cr=-1;
    int l=1,r=n;
    while (l<=r){
        int mid=l+r>>1;
        cout<<"? "<<mid<<" ";
        up(i,1,mid) cout<<i<<" ";
        cout<<endl;
        int x;
        cin>>x;
        if (x) r=mid-1;
        else l=mid+1;
    }
    if (r==n){
        cl=n;
        cr=1;
    }else{
        cl=r;
        cr=r+1;
    }
    for (int i=1;i<n;i+=2){
        cout<<"? 6 "<<cl<<" "<<cr<<" "<<i<<" "<<i+1<<" "<<cr<<" "<<cr<<endl;
        int x;
        cin>>x;
        if (x==1) res[i]=res[i+1]=')';
        elif (x==2) res[i]=')',res[i+1]='(';
        elif (x==3) res[i]='(',res[i+1]=')';
        else res[i]=res[i+1]='(';
    }
    if (n&1){
        cout<<"? 2 "<<cl<<" "<<n<<endl;
        int x;
        cin>>x;
        if (x==1) res[n]=')';
        else res[n]='(';
    }
    cout<<"! ";
    up(i,1,n) cout<<res[i];
    cout<<endl;
}
int main(){
    // ios::sync_with_stdio(false);
    // cin.tie(nullptr);
    // cout.tie(nullptr);
    int T=1;
    cin>>T;
    while(T--) solve();
}
```

### C2. [Interactive RBS (Medium Version)](https://codeforces.com/contest/2129/problem/C2)
