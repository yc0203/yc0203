---
title: Git
date: 2026-08-31 23:08:35
tags:
  - Git
  - 版本控制
  - 开发工具
categories:
  - 技术
  - Git
description: 详细介绍 Git 的作用、意义、使用方法、常用命令行与实战案例。
---

# Git 完全指南

## 一、Git 是什么

Git 是一个**分布式版本控制系统**，用于跟踪文件内容的变更，尤其是源代码文件。

简单理解：

- 它可以记录每一次文件修改
- 可以随时查看历史版本
- 可以回到过去的任意版本
- 可以多人协作开发而不互相覆盖
- 可以在不同分支上同时开发功能

Git 是目前全世界最流行的版本控制工具之一，也是 GitHub、GitLab、Gitee 等平台的基础。

---

## 二、Git 的作用和意义

### 1. 记录历史

每次提交（commit）都会保存一份快照，记录：

- 改了什么文件
- 改了什么内容
- 谁改的
- 什么时候改的
- 为什么改（提交信息）

### 2. 版本回退

代码出问题时，可以回退到之前的任意提交，避免"改坏了无法恢复"。

### 3. 分支管理

可以创建多个分支：

- `main` / `master`：主分支
- `dev`：开发分支
- `feature/xxx`：功能分支
- `bugfix/xxx`：修复分支

不同分支互不影响，开发完成后再合并。

### 4. 多人协作

多个开发者可以：

- 克隆同一个仓库
- 各自修改
- 推送到远程
- 拉取别人的更新
- 解决冲突

### 5. 代码备份和发布

通过远程仓库（GitHub / Gitee / GitLab），代码可以：

- 云端备份
- 团队共享
- 自动部署
- 开源分享

---

## 三、Git 的核心概念

### 1. 三个区域

```text
工作区（Working Directory）
    ↓ git add
暂存区（Staging Area / Index）
    ↓ git commit
本地仓库（Local Repository）
```

### 2. 四个状态

| 状态 | 说明 |
|---|---|
| Untracked | 新文件，还没被 Git 跟踪 |
| Modified | 文件已修改，还没暂存 |
| Staged | 文件已加入暂存区 |
| Committed | 文件已提交到本地仓库 |

### 3. 提交（Commit）

提交是 Git 中的一个历史节点，每个提交都有唯一的 SHA-1 哈希值。

### 4. 分支（Branch）

分支本质是指向某个提交的指针。

### 5. HEAD

HEAD 表示当前所在的位置，通常指向当前分支的最新提交。

### 6. 远程仓库（Remote）

远程仓库是存放在服务器上的 Git 仓库，常见：

```text
https://github.com/yc0203/yc0203.git
```

---

## 四、Git 安装与环境配置

### 1. 安装 Git

- Windows：https://git-scm.com/download/win
- macOS：`brew install git`
- Linux：`sudo apt install git`

### 2. 查看版本

```bash
git --version
```

### 3. 配置用户名和邮箱

```bash
git config --global user.name "yc0203"
git config --global user.email "yc0203@users.noreply.github.com"
```

### 4. 查看配置

```bash
git config --list
```

---

## 五、Git 常用命令

### 1. 初始化仓库

```bash
git init
```

把当前目录变成 Git 仓库。

### 2. 查看状态

```bash
git status
```

查看哪些文件被修改、新增、删除。

### 3. 添加文件到暂存区

```bash
git add 文件名
git add .
git add src/
```

- `git add .`：添加当前目录所有改动
- `git add src/`：添加指定目录

### 4. 提交到本地仓库

```bash
git commit -m "提交说明"
```

### 5. 查看提交历史

```bash
git log
git log --oneline
git log --graph --all
```

### 6. 查看文件差异

```bash
git diff
git diff --staged
```

### 7. 分支操作

```bash
# 查看分支
git branch

# 创建分支
git branch dev

# 切换分支
git checkout dev
# 或
git switch dev

# 创建并切换分支
git checkout -b feature/xxx
git switch -c feature/xxx

# 合并分支
git merge dev

# 删除分支
git branch -d dev
```

### 8. 远程仓库操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/yc0203/yc0203.git

# 修改远程仓库地址
git remote set-url origin https://github.com/yc0203/yc0203.git

# 删除远程仓库
git remote remove origin
```

### 9. 推送和拉取

```bash
# 推送本地分支到远程
git push -u origin main

# 拉取远程更新
git pull

# 抓取远程更新但不合并
git fetch
```

### 10. 克隆仓库

```bash
git clone https://github.com/yc0203/yc0203.git
```

### 11. 撤销操作

```bash
# 撤销工作区修改
git checkout -- 文件名

# 取消暂存
git reset HEAD 文件名

# 回退到上一个提交
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

> `--hard` 会丢弃工作区修改，慎用。

### 12. 暂存当前工作

```bash
git stash
git stash list
git stash pop
```

### 13. 删除文件

```bash
git rm 文件名
```

### 14. 忽略文件

创建 `.gitignore`：

```text
node_modules/
public/
*.log
.DS_Store
```

---

## 六、Git 实战案例

### 案例一：从零初始化项目

```bash
mkdir my-project
cd my-project
git init
git status

# 创建文件
echo "# My Project" > README.md

# 添加并提交
git add README.md
git commit -m "初始化项目"
```

### 案例二：修改文件并提交

```bash
# 修改 README.md 后
git status
git diff
git add README.md
git commit -m "更新 README"
```

### 案例三：创建分支并合并

```bash
# 创建 dev 分支
git checkout -b dev

# 在 dev 分支修改代码
git add .
git commit -m "开发新功能"

# 回到 main
git checkout main

# 合并 dev
git merge dev

# 删除 dev
git branch -d dev
```

### 案例四：推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/yc0203/yc0203.git

# 推送 main 分支
git push -u origin main
```

### 案例五：回退到某个版本

```bash
# 查看历史
git log --oneline

# 回退到指定提交
git reset --hard 提交ID

# 或者回退到上一个提交
git reset --hard HEAD~1
```

### 案例六：多人协作流程

```bash
# 克隆项目
git clone https://github.com/yc0203/yc0203.git
cd yc0203

# 创建功能分支
git checkout -b feature/login

# 开发并提交
git add .
git commit -m "完成登录功能"

# 推送分支
git push -u origin feature/login

# 在 GitHub 上发起 Pull Request
# 合并后删除远程分支
```

---

## 七、Git 常见工作流程

### 单人项目流程

```text
git init
git add .
git commit -m "提交信息"
git push
```

### 多人项目流程

```text
git clone 仓库地址
git checkout -b 功能分支
git add .
git commit -m "完成功能"
git push -u origin 功能分支
发起 Pull Request
代码评审
合并到 main
```

### Hexo 博客发布流程

```text
hexo new "文章标题"
编写 Markdown
git add .
git commit -m "新增文章"
git push
```

---

## 八、常见问题

### 1. 提交时提示需要配置用户名和邮箱

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 2. 推送被拒绝

原因可能是远程有本地没有的提交，先拉取：

```bash
git pull
git push
```

### 3. 合并冲突

冲突文件会显示：

```text
<<<<<<< HEAD
当前分支内容
=======
其他分支内容
>>>>>>> dev
```

手动修改后：

```bash
git add 冲突文件
git commit -m "解决冲突"
```

### 4. 误提交敏感信息

```bash
git reset --soft HEAD~1
```

然后修改文件，重新提交。

### 5. 想忽略 node_modules

在 `.gitignore` 中添加：

```text
node_modules/
```

---

## 九、总结

Git 是程序员必备技能之一。

掌握 Git 后，你可以：

- 安心修改代码
- 随时回到历史版本
- 高效管理分支
- 轻松参与团队协作
- 顺利发布自己的项目

建议多练习以下命令：

```bash
git init
git add
git commit
git branch
git merge
git push
git pull
git log
```

熟能生巧。
