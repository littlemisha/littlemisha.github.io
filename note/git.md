---
layout: default
title: Git 常用命令
---

# Git 常用命令

## 基础配置
设置全局用户名（提交时显示）

```bash
git config --global user.name "Your Name"
```

设置全局邮箱（提交时显示）

```bash
git config --global user.email "your@email.com"
```

设置默认文本编辑器

```bash
git config --global core.editor "code --wait"
```

## 仓库操作
初始化新仓库

```bash
git init
```

克隆远程仓库

```bash
git clone https://github.com/user/repo.git
```

## 日常使用
查看仓库状态

```bash
git status
```

添加文件到暂存区

```bash
git add filename.txt
```

添加所有修改到暂存区

```bash
git add .
```

提交更改

```bash
git commit -m "描述信息"
```

## 分支管理
查看所有分支

```bash
git branch
```

创建新分支

```bash
git branch new-branch
```

切换到分支

```bash
git checkout branch-name
```

创建并切换到新分支

```bash
git checkout -b new-branch
```

合并分支到当前分支

```bash
git merge branch-name
```

删除分支

```bash
git branch -d branch-name
```

## 远程协作
添加远程仓库

```bash
git remote add origin https://github.com/user/repo.git
```

推送到远程仓库（首次）

```bash
git push -u origin main
```

后续推送

```bash
git push
```

拉取远程更新

```bash
git pull
```

## 撤销操作
撤销工作区修改

```bash
git restore file.txt
```

撤销暂存区修改

```bash
git restore --staged file.txt
```

修改最后一次提交

```bash
git commit --amend
```

## 查看历史
查看提交历史

```bash
git log
```

简洁历史视图

```bash
git log --oneline
```

图形化历史视图

```bash
git log --graph
```

查看具体提交内容

```bash
git show commit-id
```

## 高级功能
暂存当前修改

```bash
git stash
```

恢复暂存的修改

```bash
git stash pop
```

应用特定提交到当前分支

```bash
git cherry-pick commit-id
```
将所有目录添加为安全目录

```bash
git config --global --add safe.directory "*"
```

## 标签管理
创建轻量标签

```bash
git tag v1.0
```

推送标签到远程

```bash
git push origin --tags
```