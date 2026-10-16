---
title: Windows开发者网络实操笔记：IP、端口、DNS、代理协议、环境变量避坑指南
date: 2026-09-01 14:00:00
tags:
  - Windows
  - 网络
  - DNS
  - 代理
  - 环境变量
categories:
  - 理论
  - 网络
description: 面向 Windows 开发者的网络实操笔记，覆盖 IP、端口、DNS、代理协议和系统环境变量常见坑点。
---

# Windows 开发者网络实操笔记：IP、端口、DNS、全网代理协议、系统环境变量全方位避坑

## 一、引言：浏览器能上网，命令行却超时？

很多 Windows 开发者遇到过这种怪事：

- 浏览器打开 GitHub、npm 官网都正常
- 在 PowerShell 里执行 `git pull` 却一直超时
- `curl https://www.baidu.com` 卡住
- `npm install` 报网络错误
- 关掉代理软件后，命令行反而好了

这不是电脑坏了，而是 Windows 的网络访问被拆成了多个独立通道：

```text
浏览器网络
命令行网络
应用程序网络
系统代理设置
```

它们看起来都是"上网"，但实际读取的配置可能完全不同。

这篇文章会用开发者排错视角，把 IP、端口、DNS、代理协议、环境变量这几个坑一次讲清楚。

---

## 二、IP 地址完整体系

### 1. IP 地址是什么

IP 地址就是网络世界里的"门牌号"。

一台电脑要上网，必须有一个 IP 地址，别人才能找到它。

### 2. 公网 IP

公网 IP 是全球唯一的地址，可以直接从互联网访问。

例如：

```text
8.8.8.8
114.114.114.114
```

公网 IP 通常由运营商分配，普通家庭宽带很少直接拥有固定公网 IP。

### 3. 内网私有 IP

私有 IP 只能在内网使用，不能直接从公网访问。

三大私有网段：

| 网段 | 常见场景 |
|---|---|
| `10.0.0.0/8` | 大型企业内网 |
| `172.16.0.0/12` | 企业内网、云服务器 VPC |
| `192.168.0.0/16` | 家庭路由器、小型局域网 |

例如：

```text
192.168.1.1   路由器
192.168.1.100 你的电脑
```

### 4. NAT：为什么内网机器能上网

NAT（Network Address Translation）就像小区门卫：

- 小区里的人出去时，门卫把内部房间号换成小区大门地址
- 外面的人回来时，门卫再把数据送到对应房间

所以内网机器可以上网，但外网不能直接主动连接内网机器。

### 5. 127.0.0.1：回环地址

`127.0.0.1` 代表"本机自己"。

访问 `127.0.0.1` 时，数据不会离开电脑，只在本机内部循环。

开发中常用于：

- 本地启动服务
- 测试本机程序
- 连接本机数据库

### 6. 0.0.0.0：监听地址

`0.0.0.0` 不是"访问所有机器"，而是表示"监听本机所有网卡"。

例如 Node.js 服务监听：

```powershell
node server.js
```

如果服务显示：

```text
Listening on 0.0.0.0:3000
```

表示局域网内其他机器也可以通过你的内网 IP 访问：

```text
http://192.168.1.100:3000
```

如果只监听：

```text
127.0.0.1:3000
```

那就只有本机能访问。

### 7. 安全注意

- 不要把数据库、Redis、调试服务监听在 `0.0.0.0` 后不加密码
- 云服务器安全组、Windows 防火墙必须同时开放端口
- 内网 IP 不等于安全，公网暴露需要额外防护

---

## 三、端口与套接字 Socket

### 1. 端口是什么

IP 是门牌号，端口就是房间里的不同窗口。

例如：

```text
192.168.1.100:3306
```

- `192.168.1.100`：主机
- `3306`：MySQL 数据库窗口

### 2. 端口范围

| 范围 | 类型 | 说明 |
|---|---|---|
| 0-1023 | 知名端口 | 系统服务常用 |
| 1024-49151 | 注册端口 | 应用程序常用 |
| 49152-65535 | 动态端口 | 临时连接使用 |

### 3. 常用知名端口

| 端口 | 服务 |
|---|---|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 27017 | MongoDB |
| 3000 | 常见 Node.js 开发服务 |
| 8080 | 常见代理或开发服务 |

### 4. 监听和端口占用

一个端口同一时间只能被一个程序监听。

如果端口被占用，启动服务会报错：

```text
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
```

查看端口占用：

```powershell
netstat -ano | findstr :3000
```

输出最后一列是 PID，然后查看进程：

```powershell
tasklist | findstr 12345
```

### 5. ICMP 和 TCP 的区别

很多人用 `ping` 判断服务器是否正常，但这是错误的。

`ping` 使用的是 ICMP 协议，它只能说明：

```text
对方主机是否响应网络层请求
```

它不能说明：

```text
对方的 3306、443、22 等业务端口是否可用
```

例如：

- 服务器禁 ping，但网站正常
- 服务器能 ping 通，但 Nginx 挂了
- 防火墙放行 ICMP，但拦截 TCP 443

所以判断业务端口，必须用 TCP 测试。

PowerShell TCP 端口测试：

```powershell
Test-NetConnection 192.168.1.100 -Port 3306
```

只看关键结果：

```powershell
Test-NetConnection 192.168.1.100 -Port 3306 | Select-Object ComputerName, RemotePort, TcpTestSucceeded
```

如果输出：

```text
TcpTestSucceeded : True
```

说明端口可以连通。

---

## 四、DNS 域名解析

### 1. 域名本质

域名是为了让人记住而存在的，电脑真正通信使用的是 IP。

例如：

```text
www.github.com
```

最终会被解析成某个 IP，然后建立连接。

### 2. 完整访问流程

```text
浏览器输入 www.github.com
        ↓
检查本地 DNS 缓存
        ↓
向 DNS 服务器询问：www.github.com 的 IP 是什么？
        ↓
DNS 服务器返回 IP
        ↓
浏览器使用 IP 发起 HTTPS 连接
```

查看 DNS 缓存：

```powershell
ipconfig /displaydns
```

清空 DNS 缓存：

```powershell
ipconfig /flushdns
```

### 3. DNS 污染是怎么产生的

DNS 解析结果可能被中间设备篡改，称为 DNS 污染。

表现：

```text
浏览器访问某个国外网站时，被解析到一个错误的 IP
```

常见原因：

- 运营商 DNS 被污染
- 本地 hosts 文件被修改
- 路由器 DNS 被劫持
- 本机 DNS 配置异常

查看 hosts 文件：

```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```

临时指定 DNS 测试：

```powershell
nslookup github.com 8.8.8.8
```

---

## 五、全网主流代理协议完整讲解

### 1. 为什么开发者需要代理

很多开发资源在国外：

- GitHub
- npm registry
- Python PyPI
- Docker Hub
- Google

直接访问经常超时，所以需要代理。

### 2. HTTP 代理

HTTP 代理工作在 HTTP 层，主要代理 HTTP/HTTPS 流量。

地址格式：

```text
http://127.0.0.1:7890
```

适用：

- 浏览器
- curl
- git 的 http 请求

特点：

- 配置简单
- 对 HTTP 协议支持好
- HTTPS 流量通常以 CONNECT 方式转发

### 3. SOCKS5 代理

SOCKS5 工作在传输层，可以代理 TCP 和 UDP 流量。

地址格式：

```text
socks5://127.0.0.1:7891
```

适用：

- 浏览器
- SSH
- 游戏
- 各种命令行工具

特点：

- 更通用
- 支持 TCP/UDP
- 不关心上层协议

### 4. SOCKS5h 的区别

`socks5h` 和 `socks5` 的核心区别在于 DNS 解析位置。

| 类型 | DNS 在哪里解析 | 适用场景 |
|---|---|---|
| `socks5://` | 本地解析 DNS | 本地 DNS 正常时使用 |
| `socks5h://` | 代理服务器解析 DNS | 本地 DNS 被污染时使用 |

坑点：

- 本地 DNS 污染时，`socks5://` 可能在解析域名阶段就失败
- 换成 `socks5h://` 后，域名交给代理服务器解析，反而能成功
- curl 支持 `socks5h`，很多软件不一定支持

### 5. 代理协议对比表

| 对比项 | HTTP 代理 | SOCKS5 | SOCKS5h |
|---|---|---|---|
| 工作层级 | HTTP 层 | 传输层 | 传输层 |
| 支持协议 | HTTP/HTTPS | TCP/UDP | TCP/UDP |
| DNS 解析位置 | 取决于实现 | 本地 | 代理端 |
| 配置难度 | 简单 | 中等 | 中等 |
| 典型工具 | 浏览器、git、curl | curl、ssh、部分软件 | curl、代理软件 |

### 6. Windows 特有大坑：浏览器代理和命令行代理互相独立

Windows 的"设置 -> 网络 -> 代理"通常只影响浏览器等图形软件。

Git、Node.js、Python 等命令行工具默认不会读取系统代理。

所以在 Windows 上常见：

```text
浏览器能访问 Google
git clone 超时
npm install 超时
pip install 超时
```

因为命令行工具没有走系统代理。

命令行临时使用代理：

```powershell
# git
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 取消
git config --global --unset http.proxy
git config --global --unset https.proxy

# PowerShell 当前窗口临时代理
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

Node.js/npm 使用代理：

```powershell
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
```

Python/pip 使用代理：

```powershell
pip install requests --proxy http://127.0.0.1:7890
```

---

## 六、精简传输层协议科普

### 1. TCP

TCP 是可靠的连接型协议，像寄快递：

- 要建立连接
- 有确认
- 丢包会重传
- 数据有序

开发中判断 TCP 是否通，使用端口测试。

### 2. UDP

UDP 是不可靠的无连接协议，像扔纸飞机：

- 不建立连接
- 不管有没有收到
- 速度快
- 可能丢包

常见场景：

- DNS 查询
- 视频直播
- 游戏实时通信

### 3. ICMP

ICMP 主要用来测试网络连通性，典型工具是 `ping`。

它不负责传输业务数据，只负责网络诊断。

| 协议 | 是否可靠 | 是否有连接 | 开发排错用途 |
|---|---|---|---|
| TCP | 可靠 | 有连接 | 判断业务端口、数据库、HTTP 服务 |
| UDP | 不可靠 | 无连接 | 判断 DNS、游戏、视频服务 |
| ICMP | 不可靠 | 无连接 | 判断主机是否在线、网络是否通 |

---

## 七、Windows 环境变量三级作用域

### 1. 三个作用域

Windows 环境变量分为：

| 级别 | 设置方式 | 生效范围 | 是否永久 |
|---|---|---|---|
| 会话级 | PowerShell 直接赋值 | 当前 PowerShell 窗口 | 否 |
| 用户级 | `setx` | 当前用户所有新窗口 | 是 |
| 系统级 | `setx /M` | 所有用户所有新窗口 | 是 |

### 2. PowerShell 普通变量和 $env 环境变量

PowerShell 普通变量：

```powershell
$myVar = "hello"
```

只在当前 PowerShell 会话存在。

环境变量：

```powershell
$env:MY_VAR = "hello"
```

也是只影响当前会话，但它是环境变量，子进程会继承。

区别：

```text
$myVar         普通 PowerShell 变量，不会被外部程序读取
$env:MY_VAR    环境变量，会被 git、node、python 等子进程读取
```

### 3. setx 的三大坑点

#### 坑点一：setx 只影响新窗口

```powershell
setx MY_VAR "hello"
```

执行后，当前窗口不会立即生效，必须新开一个 PowerShell 窗口。

#### 坑点二：setx 会截断长内容

`setx` 有长度限制，超过 1024 字符可能被截断。

重要路径不要用 setx 存超长内容。

#### 坑点三：setx 设置系统变量需要管理员权限

```powershell
setx MY_GLOBAL "hello" /M
```

如果没有管理员权限，会失败。

### 4. Remove-Item Env 的致命误区

很多人以为执行：

```powershell
Remove-Item Env:MY_VAR
```

就能删除环境变量。

实际上，这个命令只删除当前 PowerShell 进程内存里的环境变量，不会删除注册表里的永久变量。

查看注册表永久变量：

```powershell
# 用户级
reg query HKCU\Environment

# 系统级
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment"
```

真正删除用户级永久变量：

```powershell
reg delete HKCU\Environment /v MY_VAR /f
```

真正删除系统级永久变量：

```powershell
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v MY_VAR /f
```

删除后需要新开窗口，或者广播环境变量变更。

### 5. PowerShell Profile 的生效边界

PowerShell Profile 是每次打开 PowerShell 时自动执行的脚本。

查看路径：

```powershell
echo $PROFILE
```

常见路径：

```text
C:\Users\用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```

作用：

- 设置别名
- 预加载函数
- 设置默认编码
- 自动配置代理

注意：

- Profile 只对 PowerShell 生效
- CMD 不会读取 PowerShell Profile
- 普通命令行程序不会读取 Profile
- Profile 里设置的 `$env:` 变量只影响从 PowerShell 启动的程序

---

## 八、排错 PowerShell 命令清单

下面这些命令可以直接复制运行。

### 1. 查看本机 IP

```powershell
Get-NetIPAddress -AddressFamily IPv4
```

### 2. 测试 TCP 端口

```powershell
Test-NetConnection 192.168.1.100 -Port 3306
```

### 3. 查看 DNS 解析

```powershell
Resolve-DnsName github.com
```

### 4. 清空 DNS 缓存

```powershell
ipconfig /flushdns
```

### 5. 查看端口占用

```powershell
netstat -ano | findstr :3000
```

### 6. 查看对应进程

```powershell
tasklist | findstr PID
```

### 7. 查看当前会话代理变量

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match "PROXY" }
```

### 8. 临时设置代理

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

### 9. 临时取消代理

```powershell
Remove-Item Env:HTTP_PROXY
Remove-Item Env:HTTPS_PROXY
```

注意：这只是当前窗口临时取消。

### 10. 永久设置用户环境变量

```powershell
setx MY_VAR "hello"
```

### 11. 查看用户永久环境变量

```powershell
reg query HKCU\Environment
```

### 12. 真正删除用户永久环境变量

```powershell
reg delete HKCU\Environment /v MY_VAR /f
```

### 13. 测试 git 代理

```powershell
git config --global --get http.proxy
git config --global --get https.proxy
```

### 14. 测试 npm 代理

```powershell
npm config get proxy
npm config get https-proxy
```

---

## 九、记忆口诀

```text
IP 找机器，端口找服务
ping 测主机，TCP 测端口
浏览器走系统代理，命令行要单独配
DNS 被污染，就换 socks5h
setx 改注册表，新窗口才生效
Remove Env 只清内存，删注册表要 reg
```

---

## 十、开发最佳实践总结

### 1. 代理调试原则

- 先分清是浏览器问题还是命令行问题
- 命令行超时优先检查 `HTTP_PROXY` / `HTTPS_PROXY`
- git 单独检查 git 代理
- npm 单独检查 npm 代理
- DNS 污染时优先使用 `socks5h`

### 2. 临时变量使用原则

- 只影响当前窗口，使用 `$env:`
- 适合临时测试代理、测试路径
- 关掉窗口即失效，安全干净

### 3. 永久变量使用原则

- 使用 `setx` 或系统设置
- 设置后必须新开窗口
- 删除永久变量使用 `reg delete`
- 不要用 `Remove-Item Env:` 删除永久变量

### 4. 日常开发推荐

```powershell
# 当前窗口临时使用代理
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"

# 临时取消
Remove-Item Env:HTTP_PROXY
Remove-Item Env:HTTPS_PROXY

# 确认端口
Test-NetConnection github.com -Port 443
```

这篇文章的核心就是：

```text
在 Windows 上开发，不要默认"能上网=命令行能上网"。
```

只要记住这句话，很多网络玄学问题都能少踩一半坑。
