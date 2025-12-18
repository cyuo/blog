---
title: JQDataSDK Python 基金数据查询
published: 2025-01-17 14:48:31
description: ''
image: ''
tags: [api, python]
category: '技术教程'
draft: false 
lang: ''
---
## 维护

### 安装

```powershell
pip install jqdatasdk
```

### 升级

```powershell
pip install -U jqdatasdk
```

## 初始化

### 认证

```python
auth(account,password)
```

账号即手机号，密码即登陆密码

### 查询剩余流量

```python
get_query_count()
```

示例：

```python
>>> get_query_count()
{'total': 1000000,'spare': 1000000}
```

## 基金基本信息

### 将标的代码转化成聚宽标准格式

```python
normalize_code(code)
normalize_code([code,...])
```

code 应为 聚宽标准格式。

示例：

```python
>>> normalize_code("510880")
'510880.XSHG'
>>> normalize_code(["510880","513110"])
['510880.XSHG', '513110.XSHG']
```

### 获取单支标的信息

```python
get_security_info(code)
```

返回值：

|     属性     |         名称         |                             备注                             |
| :----------: | :------------------: | :----------------------------------------------------------: |
| display_name |       中文名称       |                                                              |
|     name     |       缩写简称       |                                                              |
|  start_date  |       上市日期       |                     [datetime.date] 类型                     |
|   end_date   |       退市日期       |      [datetime.date] 类型, 如果没有退市则为 2200-01-01       |
|     type     |         类型         | stock ( 股票 ), index ( 指数 ), etf ( ETF 基金) , fja ( 分级 A ), fjb ( 分级 B ) |
|    parent    | 分级基金的母基金代码 |                                                              |

示例：

```python
>>> a=get_security_info('510880.XSHG')
>>> a.display_name
'红利ETF'
>>> a.name
'HLETF'
>>> a.start_date
datetime.date(2007, 1, 18)
>>> a.end_date
datetime.date(2200, 1, 1)
>>> a.type
'etf'
>>> a.parent
>>> type(a.parent)
<class 'NoneType'>
```

## 查询

### 通过 Query 类查询基金信息

从 `finance.FUND_NET_VALUE` 表中查询。

```python
table=finance.FUND_NET_VALUE
q=query(table)
```

指定 code（标准 code，即形如 `"510880"` 的纯数字代码）。

```python
q=q.filter(table.code==code)
```

如果要指定多个 code，可以

```python
funds=[fund,...]
q=q.filter(table.code.in_(funds))
```

限定日期范围。

op 为 `>` `>=` `==` `<=` `<` `!=` 中的一种。

date 为字符串型，如 `"2025-01-01"`。

```python
q=q.filter(table.day op date)
```

取反条件使用 `~` 符号，比如

```python
q=q.filter(~(table.day < "2025-01-01"))
```

想要同时满足（与）多个条件可以一起传入，比如

```python
q=q.filter(
    table.code=="510880",
    table.day >= "2025-01-01",
    table.day <= "2025-01-10"
)
```

或者使用 `sqlalchemy.sql.expression` 中的 `or_` `and_` `not_` 实现逻辑或，与，非关系

```python
from sqlalchemy.sql.expression import or_,and_,not_
q=q.filter(or_(
	table.code=="510880",
    table.code=="513110"
))
```

使用 `order_by` 可以指定排序顺序。

```python
q=q.order_by(table.day.desc()) # 降序
q=q.order_by(table.day.asc()) # 升序
```

如果要限制长度，可以

```python
q=q.limit(n)
```

最后执行查询

```python
res=finance.run_query(q)
```

`run_query` 方法最多获取 5000 条数据（无论 `limit` 到多少），可以使用 `run_offset_query` 方法分页查询，返回最多 20 万条数据。

```python
res=finance.run_offset_query(q) 
```

### 简单内置函数查询

```python
get_extras(info, security_list, start_date='2015-01-01', end_date='2015-12-31', df=True, count=None)
```
