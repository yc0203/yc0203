# Hexo + Butterfly 主题 + GitHub Pages 个人博客搭建指南

本文是一份从零开始的详细搭建教程，适合新手。整体思路是：

> **本地写作 → Hexo 生成静态网页 → 推送到 GitHub → GitHub Pages 自动发布**

---

## 一、方案架构与各部分作用

```text
┌─────────────┐      ┌──────────────┐      ┌──────────────┐      ┌─────────────────┐
│  本地电脑     │      │  Hexo 生成器  │      │  GitHub 仓库  │      │  GitHub Pages   │
│ Markdown写作 │ ───▶ │  生成静态HTML  │ ───▶ │  存放网页文件  │ ───▶ │  公网访问博客    │
└─────────────┘      └──────────────┘      └──────────────┘      └─────────────────┘
```

### 各部分作用

| 组成部分 | 作用 |
| --- | --- |
| **Node.js** | 提供 JavaScript 运行环境，Hexo 依赖它运行 |
| **npm** | Node.js 的包管理器，用来安装 Hexo 和插件 |
| **Hexo** | 静态博客生成器，把 Markdown 文章转换成 HTML/CSS/JS 静态文件 |
| **Butterfly 主题** | 决定博客的外观、布局、功能，类似博客的“皮肤” |
| **Markdown** | 写文章使用的轻量标记语言，简单易学 |
| **Git** | 版本管理工具，把文件提交并推送到 GitHub |
| **GitHub** | 存放代码/网站文件的远程仓库 |
| **GitHub Pages** | GitHub 提供的免费静态网站托管服务，可以绑定自己的域名 |

---

## 二、准备工作

### 1. 注册 GitHub 账号

访问 https://github.com 注册一个账号。  
后面需要用它创建仓库和开启 Pages。

### 2. 安装 Node.js

- 访问 https://nodejs.org
- 下载 **LTS 版本**（长期支持版）
- 安装时一路默认即可

安装完成后，打开命令行工具（Windows 推荐 PowerShell），验证：

```bash
node -v
npm -v
```

能看到版本号说明安装成功。

### 3. 安装 Git

- 访问 https://git-scm.com
- 下载并安装
- 安装时保持默认选项即可

验证：

```bash
git --version
```

### 4. 准备一个编辑器

推荐使用：

- **VS Code**：https://code.visualstudio.com
- 或任意文本编辑器，如 Typora、记事本

---

## 三、安装并初始化 Hexo

### 1. 全局安装 Hexo 命令行工具

```bash
npm install -g hexo-cli
```

**作用：** 把 `hexo` 命令安装到全局，之后可以在任意目录使用。

### 2. 创建博客目录

在你想放博客的目录下执行：

```bash
hexo init blog
```

**作用：** 初始化一个名为 `blog` 的 Hexo 博客项目，自动生成基础目录结构和默认文件。

### 3. 进入博客目录

```bash
cd blog
```

**作用：** 切换到博客项目目录，后续命令都在这里执行。

### 4. 安装依赖

```bash
npm install
```

**作用：** 根据 `package.json` 安装 Hexo 所需的依赖包。

### 5. 本地预览

```bash
hexo server
```

**作用：** 启动本地预览服务器。默认地址是：

```text
http://localhost:4000
```

在浏览器打开就能看到默认博客。按 `Ctrl + C` 可以停止服务器。

> 之后每次修改配置或写文章，都可以用 `hexo server` 在本地预览。

---

## 四、安装 Butterfly 主题

### 1. 下载主题到 `themes/butterfly`

在博客根目录执行：

```bash
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

**作用：** 把 Butterfly 主题源码下载到 `themes/butterfly` 目录。

### 2. 修改主配置文件

打开博客根目录的 `_config.yml`，找到 `theme`：

```yaml
theme: butterfly
```

**作用：** 告诉 Hexo 使用 Butterfly 主题。

### 3. 安装 Butterfly 依赖渲染器

Butterfly 主题依赖两个额外的渲染插件：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

**作用：** 让 Hexo 能正确渲染 Butterfly 使用的 Pug 模板和 Stylus 样式。

### 4. 重启预览

```bash
hexo clean
hexo server
```

**作用：** 清理缓存后重新生成并预览。如果页面变成 Butterfly 风格，说明主题安装成功。

---

## 五、配置站点基本信息

编辑博客根目录的 `_config.yml`（这是 Hexo 主配置文件）。

### 1. 站点信息

```yaml
title: 我的博客
subtitle: 记录生活与技术
description: 一个分享技术、生活与思考的个人博客
author: 你的名字
language: zh-CN
timezone: Asia/Shanghai
```

| 配置项 | 作用 |
| --- | --- |
| `title` | 博客标题，显示在浏览器标签和首页 |
| `subtitle` | 副标题 |
| `description` | 站点描述，有利于 SEO |
| `author` | 作者名称，会显示在文章信息中 |
| `language` | 站点语言，设为 `zh-CN` 后主题界面显示中文 |
| `timezone` | 时区，设为 `Asia/Shanghai` 显示中国时间 |

### 2. 网址配置

```yaml
url: https://你的用户名.github.io
root: /
```

**作用：** 告诉 Hexo 网站最终访问地址。  
如果你以后绑定自己的域名，把 `url` 改成你的域名。

### 3. 本地预览端口（可选）

```yaml
server:
  port: 4000
```

---

## 六、配置 Butterfly 主题

Butterfly 支持在主目录下使用单独的 `_config.butterfly.yml` 配置文件，这样不会和 Hexo 主配置混淆。

### 1. 生成主题配置文件

把主题目录下的默认配置复制到博客根目录：

```bash
cp themes/butterfly/_config.yml _config.butterfly.yml
```

> Windows PowerShell 也可以执行这个命令；如果不行，直接手动复制文件。

**作用：** 在根目录生成一个独立的 Butterfly 主题配置，方便后续修改。

### 2. 常用配置说明

#### 导航菜单

```yaml
menu:
  首页: /
  归档: /archives/
  标签: /tags/
  分类: /categories/
  关于: /about/
```

#### 头像

```yaml
avatar:
  img: /img/avatar.png
```

#### 侧边栏

```yaml
aside:
  enable: true
  hide: false
```

#### 首页 Banner

```yaml
banner:
  enable: true
```

#### 社交链接

```yaml
social:
  github: https://github.com/你的用户名 || fab fa-github
  email: mailto:you@example.com || fas fa-envelope
```

#### 评论系统（以 waline 为例）

```yaml
comments:
  use: waline
  waline:
    serverURL: https://你的waline服务地址
```

> 评论系统不是必须的，可以先关掉或以后再加。

### 3. 创建必要页面

Butterfly 默认需要一些页面，执行：

```bash
hexo new page tags
hexo new page categories
hexo new page about
```

**作用：** 生成“标签”“分类”“关于”等独立页面。  
生成后编辑对应的 `index.md`，把 `type` 设置为：

```markdown
---
title: 标签
date: 2025-01-01 00:00:00
type: tags
---

---
title: 分类
date: 2025-01-01 00:00:00
type: categories
---

---
title: 关于
date: 2025-01-01 00:00:00
type: about
---
```

---

## 七、创建 GitHub 仓库

### 1. 新建仓库

登录 GitHub，点击右上角 `+` → `New repository`。

- Repository name：填写 `你的用户名.github.io`
  - 例如：用户名为 `zhangsan`，则仓库名为 `zhangsan.github.io`
- 选择 **Public**（公开）
- 不要勾选 “Add a README file”

**作用：** 这是你的博客网站仓库，GitHub Pages 会从这个仓库发布网页。

### 2. 把本地博客源码推送到 GitHub

在本地博客目录执行：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

| 命令 | 作用 |
| --- | --- |
| `git init` | 初始化 Git 仓库 |
| `git add .` | 把所有文件加入暂存区 |
| `git commit -m "init blog"` | 提交当前快照，`-m` 后面是提交说明 |
| `git branch -M main` | 把默认分支命名为 `main` |
| `git remote add origin ...` | 把本地仓库关联到 GitHub 远程仓库 |
| `git push -u origin main` | 把本地 `main` 分支推送到 GitHub |

> 这里 `main` 分支保存的是**博客源码**，包括 Markdown、配置文件等。

---

## 八、配置自动/手动部署到 GitHub Pages

有两种常见方式，推荐新手先使用第一种，简单直观。

### 方式一：hexo-deployer-git 一键部署（推荐）

#### 1. 安装部署插件

```bash
npm install hexo-deployer-git --save
```

**作用：** 安装 Hexo 的 Git 部署插件，让 `hexo deploy` 自动把生成好的网页推送到 GitHub。

#### 2. 修改 `_config.yml` 中的部署配置

```yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io.git
  branch: gh-pages
  message: Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}
```

| 配置项 | 作用 |
| --- | --- |
| `type: git` | 指定使用 Git 部署 |
| `repo` | GitHub 仓库地址 |
| `branch` | 网页文件推送到 `gh-pages` 分支 |
| `message` | 自动提交时的说明信息 |

#### 3. 首次部署

```bash
hexo clean
hexo generate
hexo deploy
```

| 命令 | 作用 |
| --- | --- |
| `hexo clean` | 删除缓存和旧生成的 `public` 目录 |
| `hexo generate` | 根据 Markdown 生成静态网页到 `public/` |
| `hexo deploy` | 把 `public/` 内容推送到 GitHub 的 `gh-pages` 分支 |

> 如果 `gh-pages` 分支是第一次创建，GitHub 会自动创建。

#### 4. 开启 GitHub Pages

在 GitHub 仓库页面：

1. 打开 **Settings**
2. 左侧找到 **Pages**
3. 在 **Branch** 下拉框选择 `gh-pages`
4. 目录选择 `/ (root)`
5. 点击 **Save**

等待一两分钟后，访问：

```text
https://你的用户名.github.io
```

就能看到你的博客了。

---

### 方式二：GitHub Actions 自动部署（进阶推荐）

这种方式不用在本地执行 `hexo deploy`，推送源码到 `main` 分支后，GitHub 自动构建并发布。

#### 1. 在仓库中创建 Actions 文件

在博客项目根目录创建：

```text
.github/workflows/deploy.yml
```

内容如下：

```yaml
name: Deploy Hexo Blog

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Generate static files
        run: npx hexo generate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
```

**作用：** 每次把代码推送到 `main` 分支，GitHub 就会自动帮你执行构建并部署到 `gh-pages` 分支。

#### 2. 推送后等待自动构建

```bash
git add .
git commit -m "add github actions"
git push
```

然后到 GitHub 仓库的 **Actions** 标签页查看构建状态。  
构建完成后，GitHub Pages 会自动更新。

---

## 九、博客部署完整流程图

```text
写文章 Markdown
      │
      ▼
hexo generate   ← 生成 public/ 静态网页
      │
      ▼
hexo deploy     ← 推送到 gh-pages 分支
      │
      ▼
GitHub Pages    ← 公网可访问
      │
      ▼
浏览器打开 https://用户名.github.io
```

如果使用 GitHub Actions：

```text
git push 源码到 main
      │
      ▼
GitHub Actions 自动 npm install + hexo generate
      │
      ▼
自动推送到 gh-pages
      │
      ▼
GitHub Pages 更新
```

---

## 十、后续添加文章的步骤

以后写新文章只需要四步：

### 1. 创建新文章

```bash
hexo new "文章标题"
```

**作用：** 在 `source/_posts/` 目录下生成一个 Markdown 文件，例如 `文章标题.md`。

### 2. 编辑文章内容

打开生成的 Markdown 文件，开头是 Front Matter：

```markdown
---
title: 文章标题
date: 2025-01-01 12:00:00
tags:
  - Hexo
  - 博客
categories:
  - 技术
cover: /img/cover.jpg
description: 这篇文章介绍如何搭建博客
---

这里是正文，使用 Markdown 语法写作。
```

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题 |
| `date` | 发布时间 |
| `tags` | 文章标签，可写多个 |
| `categories` | 文章分类 |
| `cover` | 文章封面图 |
| `description` | 文章摘要描述 |

然后继续往下写正文即可。

### 3. 本地预览检查

```bash
hexo clean
hexo server
```

打开 `http://localhost:4000` 检查排版、图片、标签是否正确。

### 4. 部署上线

如果使用手动部署：

```bash
hexo clean
hexo generate
hexo deploy
```

如果使用 GitHub Actions：

```bash
git add .
git commit -m "新增文章：文章标题"
git push
```

等 GitHub Actions 自动构建完成后，博客就更新了。

---

## 十一、给博客绑定自己的域名（可选）

1. 在域名服务商处添加解析记录：

```text
类型：CNAME
主机记录：www
记录值：你的用户名.github.io
```

2. 在博客 `source/` 目录下新建文件 `CNAME`，内容写你的域名：

```text
www.example.com
```

3. 重新生成并部署：

```bash
hexo clean && hexo generate && hexo deploy
```

4. 到 GitHub Pages 设置页填写你的自定义域名。

---

## 十二、常用命令速查表

| 命令 | 作用 |
| --- | --- |
| `hexo init blog` | 初始化博客项目 |
| `hexo new "标题"` | 新建文章 |
| `hexo new page tags` | 新建页面 |
| `hexo server` | 本地预览 |
| `hexo clean` | 清理缓存和生成目录 |
| `hexo generate` | 生成静态网页 |
| `hexo deploy` | 部署到 GitHub |
| `hexo clean && hexo generate && hexo deploy` | 一键生成并部署 |
| `git status` | 查看文件改动 |
| `git add .` | 暂存所有改动 |
| `git commit -m "说明"` | 提交改动 |
| `git push` | 推送到远程仓库 |

---

## 十三、常见问题

### 1. 页面没有应用 Butterfly 主题

检查根目录 `_config.yml`：

```yaml
theme: butterfly
```

并确认已经安装：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

### 2. 部署时提示需要 GitHub 登录

如果使用 HTTPS 方式推送，建议改用 **Personal Access Token**：

```bash
git remote set-url origin https://你的用户名:你的TOKEN@github.com/你的用户名/你的用户名.github.io.git
```

或者配置 SSH 方式。

### 3. 图片不显示

- 图片放在 `source/images/` 目录下
- 文章中引用：

```markdown
![图片说明](/images/图片名.png)
```

### 4. `hexo server` 提示端口被占用

换一个端口：

```bash
hexo server -p 5000
```

### 5. 修改配置后不生效

先执行：

```bash
hexo clean
hexo generate
```

再刷新浏览器。

---

## 十四、目录结构说明

```text
blog/
├── _config.yml              # Hexo 主配置
├── _config.butterfly.yml    # Butterfly 主题配置
├── package.json             # 项目依赖列表
├── scaffolds/               # 新文章模板
├── source/
│   ├── _posts/              # 所有 Markdown 文章
│   ├── images/              # 图片等静态资源
│   ├── tags/                # 标签页面
│   ├── categories/          # 分类页面
│   └── about/               # 关于页面
├── themes/
│   └── butterfly/           # Butterfly 主题源码
└── public/                  # 生成的静态网站（部署用）
```

---

到这里，你的 Hexo + Butterfly + GitHub Pages 博客就完整搭建好了。

接下来要做的就是：**多写文章、多备份源码、持续更新**。
