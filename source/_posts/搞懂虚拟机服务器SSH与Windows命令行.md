---
title: 搞懂虚拟机、服务器、SSH、CMD 和 PowerShell
date: 2026-09-01 12:00:00
tags:
  - 科普
  - 虚拟机
  - 服务器
  - SSH
  - CMD
  - PowerShell
categories:
  - 技术
  - 科普
description: 面向新手的科普文章，用类比讲清虚拟机、服务器、SSH、CMD 和 PowerShell 是什么，怎么用。
---

# 搞懂虚拟机、服务器、SSH、CMD 和 PowerShell

这是一篇给计算机入门学习者看的科普文章。  
我会尽量少用难懂术语，多用类比，把下面几个东西讲清楚：

- 虚拟机
- 服务器
- SSH
- CMD
- PowerShell

---

## 〇、先建立一个整体印象

可以把你的电脑理解成一个"大房子"。

- CMD 和 PowerShell 是房子里的"对讲机"，用来给电脑下达命令。
- 虚拟机是在房子里再隔出一个小房间，小房间可以装另一个操作系统。
- 服务器是专门给很多人提供服务的"公共设施"。
- SSH 是一把"远程钥匙"，让你从家里安全地打开远方服务器的门。

下面一个一个说。

---

## 一、虚拟机

### ① 概念简单定义

虚拟机（Virtual Machine，简称 VM）就是用软件模拟出来的一台"假电脑"。

它运行在你的真实电脑里，但看起来、用起来都像一台独立电脑。

你可以在这台"假电脑"里安装 Windows、Linux、macOS 等操作系统。

### ② 核心用途

- 在不动自己主系统的情况下，体验其他操作系统
- 测试软件，不怕弄坏自己的电脑
- 学习 Linux 系统
- 隔离运行不安全的程序
- 搭建本地测试环境

### ③ 适用场景

- 初学者学习 Linux
- 程序员测试代码
- 安全人员分析病毒
- 需要多个隔离环境时

### ④ 常用指令

虚拟机本身没有统一的命令，但常见工具提供命令行：

```bash
# VirtualBox：查看所有虚拟机
VBoxManage list vms

# Vagrant：初始化一个虚拟机配置
vagrant init

# Vagrant：启动虚拟机
vagrant up

# Vagrant：进入虚拟机
vagrant ssh

# Vagrant：关闭虚拟机
vagrant halt

# Vagrant：删除虚拟机
vagrant destroy
```

> Vagrant 是一个管理虚拟机的工具，适合新手快速创建 Linux 虚拟机。

### ⑤ 真实案例：用 Vagrant 创建 Ubuntu 虚拟机

```bash
# 1. 创建一个项目目录
mkdir my-vm
cd my-vm

# 2. 初始化 Vagrant 配置
vagrant init ubuntu/jammy64

# 3. 启动虚拟机
vagrant up

# 4. 通过 SSH 进入虚拟机
vagrant ssh

# 5. 进入后可以执行 Linux 命令
ls
whoami
uname -a

# 6. 退出虚拟机
exit

# 7. 关闭虚拟机
vagrant halt
```

---

## 二、服务器

### ① 概念简单定义

服务器是一台"专门给别人提供服务的电脑"。

它通常：

- 长时间开机
- 配置较高
- 放在机房或云端
- 通过网络被远程访问

### ② 物理服务器 / 云服务器

| 类型 | 是什么 | 优点 | 缺点 |
|---|---|---|---|
| 物理服务器 | 真实的硬件电脑 | 性能强、可控性高 | 贵、需要维护、需要机房 |
| 云服务器 | 云厂商提供的虚拟服务器 | 便宜、弹性、随时创建 | 性能受共享环境影响 |

云服务器常见厂商：

- 阿里云
- 腾讯云
- 华为云
- AWS
- Azure

### ③ 能干什么

- 部署网站
- 运行数据库
- 跑程序
- 存放文件
- 提供 API 服务
- 运行爬虫、自动化任务

### ④ 常用指令

服务器大多运行 Linux，所以常用命令如下：

```bash
# 查看当前用户
whoami

# 查看当前目录
pwd

# 查看磁盘空间
df -h

# 查看内存
free -h

# 查看 CPU 占用
top

# 查看系统版本
uname -a

# 查看网络连通性
ping baidu.com

# 下载文件
curl -O https://example.com/file.zip

# 安装软件（Ubuntu/Debian）
sudo apt update
sudo apt install nginx

# 启动服务
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx
```

### ⑤ 真实案例：云服务器上安装 Nginx

```bash
# 1. 用 SSH 登录服务器
ssh root@你的服务器IP

# 2. 更新软件源
sudo apt update

# 3. 安装 Nginx
sudo apt install nginx -y

# 4. 启动 Nginx
sudo systemctl start nginx

# 5. 查看 Nginx 状态
sudo systemctl status nginx

# 6. 在浏览器访问
# http://你的服务器IP
```

---

## 三、SSH

### ① 概念简单定义

SSH 全称 Secure Shell，是一种"安全的远程登录协议"。

它让你可以在自己的电脑上，通过网络操作另一台电脑，就像坐在那台电脑面前一样。

### ② 作用

- 远程登录服务器
- 远程执行命令
- 安全传输文件
- 管理云服务器

### ③ 什么时候要用到 SSH

- 买了云服务器，需要登录配置
- 想远程管理家里的 Linux 电脑
- 需要操作没有显示器的服务器
- 通过 Git 连接 GitHub 等平台

### ④ 常用指令

```bash
# 使用默认端口连接远程服务器
ssh 用户名@服务器IP

# 指定端口连接
ssh -p 2222 用户名@服务器IP

# 生成密钥对
ssh-keygen -t rsa -b 4096

# 把公钥复制到服务器
ssh-copy-id 用户名@服务器IP

# 从远程服务器复制文件到本地
scp 用户名@服务器IP:/远程路径/文件 本地路径

# 把本地文件复制到远程服务器
scp 本地文件 用户名@服务器IP:/远程路径/
```

### ⑤ SSH 本地和远程的区别

| 概念 | 是什么 |
|---|---|
| SSH 本地 | 指"你本机上的 SSH 客户端"，比如 Windows 上的 `ssh` 命令 |
| SSH 远程 | 指"服务器上运行的 SSH 服务端"，负责接受你的连接 |

简单说：

- 你的电脑是"钥匙"
- 服务器是"锁"
- SSH 客户端负责开锁
- SSH 服务端负责验证钥匙

### ⑥ 真实案例：Windows 用 SSH 连接 Linux

```powershell
ssh root@192.168.1.100
```

第一次连接会提示确认指纹：

```text
Are you sure you want to continue connecting (yes/no)?
```

输入：

```text
yes
```

然后输入密码，登录成功。

---

## 四、CMD（命令提示符）

### ① 概念简单定义

CMD 是 Windows 自带的命令行程序，也叫命令提示符。

它通过输入命令来操作电脑，比如查看文件、运行程序、测试网络。

### ② 用途

- 查看文件目录
- 创建、删除文件
- 测试网络
- 查看 IP 地址
- 运行程序

### ③ 常用指令

```cmd
:: 查看当前目录
dir

:: 进入目录
cd C:\Users

:: 返回上一级
cd ..

:: 创建文件夹
mkdir test

:: 创建空文件
type nul > a.txt

:: 删除文件
del a.txt

:: 删除文件夹
rmdir test

:: 查看 IP 地址
ipconfig

:: 测试网络
ping baidu.com

:: 清空屏幕
cls

:: 退出 CMD
exit
```

### ④ 真实案例：用 CMD 创建文件夹并测试网络

```cmd
:: 1. 查看当前目录
dir

:: 2. 创建文件夹
mkdir my-test

:: 3. 进入文件夹
cd my-test

:: 4. 创建空文件
type nul > hello.txt

:: 5. 返回上级目录
cd ..

:: 6. 测试网络
ping baidu.com

:: 7. 清屏
cls
```

---

## 五、PowerShell

### ① 概念简单定义

PowerShell 是 Windows 推出的更强大的命令行工具。

它不仅能执行传统命令，还能管理 Windows 系统、操作文件、查看进程、调用系统服务。

### ② 和 CMD 的区别

| 对比项 | CMD | PowerShell |
|---|---|---|
| 出现时间 | 很早 | 更晚 |
| 命令风格 | 简单传统 | 更强大 |
| 对象处理 | 文本 | 对象 |
| 脚本能力 | 弱 | 强 |
| 可管理性 | 一般 | 强 |
| 兼容 CMD 命令 | - | 大部分支持 |

### ③ 优势

- 命令更丰富
- 可以处理结构化数据
- 可以写复杂脚本
- 可以管理系统服务、进程、注册表
- 支持管道 `|`
- 可以直接使用 `ssh`、`curl` 等工具

### ④ 常用指令

```powershell
# 查看当前目录
Get-Location
# 简写
pwd

# 查看目录内容
Get-ChildItem
# 简写
ls
# 或
dir

# 进入目录
Set-Location C:\Users
# 简写
cd C:\Users

# 创建文件夹
New-Item -ItemType Directory -Path C:\test

# 创建文件
New-Item -ItemType File -Path C:\test\a.txt

# 复制文件
Copy-Item a.txt b.txt

# 删除文件
Remove-Item a.txt

# 查看进程
Get-Process

# 查看服务
Get-Service

# 测试网络
Test-Connection baidu.com

# 查看 IP
Get-NetIPAddress

# 清屏
Clear-Host
# 或
cls

# 退出
exit
```

### ⑤ 真实案例：用 PowerShell 查看进程并创建文件

```powershell
# 1. 查看所有正在运行的进程
Get-Process

# 2. 只看前 10 个进程
Get-Process | Select-Object -First 10

# 3. 创建测试文件夹
New-Item -ItemType Directory -Path C:\ps-test

# 4. 进入文件夹
cd C:\ps-test

# 5. 创建文件
New-Item -ItemType File -Path hello.txt

# 6. 写入内容
Set-Content -Path hello.txt -Value "Hello PowerShell"

# 7. 查看内容
Get-Content hello.txt
```

---

## 六、对比小节

### 1. CMD vs PowerShell

| 维度 | CMD | PowerShell |
|---|---|---|
| 定位 | 传统命令行 | 现代命令行 + 脚本平台 |
| 适合新手 | 简单 | 稍微复杂但更强大 |
| 命令输出 | 纯文本 | 对象 |
| 管道 | 有但很弱 | 非常强大 |
| 文件管理 | 基本可用 | 强大 |
| 系统管理 | 有限 | 非常强 |

新手建议：先学 CMD，再学 PowerShell。  
日常使用可以直接用 PowerShell，因为大部分 CMD 命令在 PowerShell 里也能用。

### 2. SSH 本地和远程的区别

| 名称 | 实际含义 |
|---|---|
| SSH 本地 | 你电脑上的 SSH 客户端程序 |
| SSH 远程 | 服务器上的 SSH 服务端程序 |

连接流程：

```text
本地 SSH 客户端
    ↓
发送连接请求
    ↓
服务器 SSH 服务端
    ↓
验证用户名和密码 / 密钥
    ↓
登录成功
```

### 3. 虚拟机和云服务器的差别

| 对比项 | 虚拟机 | 云服务器 |
|---|---|---|
| 运行位置 | 自己电脑上 | 云厂商机房 |
| 硬件来源 | 自己电脑分出来的资源 | 云端真实服务器 |
| 是否常开 | 通常需要手动开启 | 一般 24 小时运行 |
| 访问方式 | 本机操作 | 通过 SSH 远程访问 |
| 用途 | 学习、测试 | 部署网站、提供服务 |

一句话：

- 虚拟机是"自己电脑里模拟的电脑"
- 云服务器是"别人机房里的电脑，通过网络租给你"

---

## 七、完整实操案例

### 案例 1：Windows 使用 PowerShell 通过 SSH 连接远程 Linux 服务器

适用场景：

- 你买了一台云服务器
- 服务器 IP：`123.45.67.89`
- 用户名：`root`
- 系统：Ubuntu

步骤：

```powershell
# 1. 打开 PowerShell

# 2. 测试本机网络
ping 123.45.67.89

# 3. 使用 SSH 登录服务器
ssh root@123.45.67.89
```

第一次连接：

```text
The authenticity of host ... can't be established.
Are you sure you want to continue connecting (yes/no)?
```

输入：

```text
yes
```

然后输入密码：

```text
root@123.45.67.89's password:
```

登录成功后，命令行前面会变成：

```text
root@服务器主机名:~#
```

现在你可以执行 Linux 命令：

```bash
whoami
uname -a
df -h
free -h
```

退出登录：

```bash
exit
```

### 案例 2：用 PowerShell 查看本机 IP 和网络

```powershell
# 查看所有 IP 地址
Get-NetIPAddress

# 只看 IPv4
Get-NetIPAddress -AddressFamily IPv4

# 测试网络是否通
Test-Connection baidu.com
```

### 案例 3：用 CMD 创建目录和文件

```cmd
cd C:\
mkdir my-blog-test
cd my-blog-test
type nul > readme.txt
dir
```

### 案例 4：用 PowerShell 查看系统服务

```powershell
# 查看所有服务
Get-Service

# 只看正在运行的服务
Get-Service | Where-Object { $_.Status -eq "Running" }
```

### 案例 5：用 Vagrant 创建虚拟机并通过 SSH 进入

```bash
mkdir ubuntu-vm
cd ubuntu-vm
vagrant init ubuntu/jammy64
vagrant up
vagrant ssh
```

进入虚拟机后：

```bash
ls
whoami
cat /etc/os-release
```

退出：

```bash
exit
vagrant halt
```

---

## 八、总结

| 工具 | 一句话理解 |
|---|---|
| 虚拟机 | 自己电脑里模拟出来的另一台电脑 |
| 服务器 | 给别人提供服务的电脑 |
| SSH | 安全远程登录服务器的协议 |
| CMD | Windows 自带的传统命令行 |
| PowerShell | Windows 更强大的现代命令行 |

学习顺序建议：

1. 先掌握 CMD / PowerShell 基本操作
2. 再用虚拟机安装一个 Linux
3. 然后尝试用 SSH 连接虚拟机
4. 最后把项目部署到云服务器

这样你就能把这几样东西串起来了。
