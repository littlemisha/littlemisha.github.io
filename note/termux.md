---
layout: default
title: Termux 基础命令
---

# Termux 基础命令

> Android 上的 Linux 终端环境

## 🔧 系统管理
更新所有软件包：
```bash
pkg update && pkg upgrade
```

安装软件（例如安装 Python）：
```bash
pkg install python
```

卸载软件：
```bash
pkg uninstall <包名>
```

搜索软件包：
```bash
pkg search <关键词>
```

查看磁盘空间：
```bash
df -h
```

## 📁 文件操作
申请存储权限：
```bash
termux-setup-storage
```

访问手机存储：
```bash
cd ~/storage/shared
```

查看当前目录：
```bash
pwd
```

列出文件：
```bash
ls
```

详细文件列表：
```bash
ls -l
```

显示隐藏文件：
```bash
ls -a
```

切换目录：
```bash
cd <目录名>
```

返回上级目录：
```bash
cd ..
```

创建目录：
```bash
mkdir <目录名>
```

复制文件：
```bash
cp <源文件> <目标位置>
```

移动/重命名文件：
```bash
mv <源文件> <目标位置>
```

删除文件：
```bash
rm <文件名>
```

递归删除目录：
```bash
rm -r <目录名>
```

查看文件内容：
```bash
cat <文件名>
```

分页查看文件：
```bash
less <文件名>
```

## ⚙️ 实用工具
使用 nano 编辑文件：
```bash
nano <文件名>
```

查看进程：
```bash
ps aux
```

结束进程（使用进程ID）：
```bash
kill <PID>
```

按名称结束进程：
```bash
killall <进程名>
```

网络测试：
```bash
ping google.com
```

使用 curl 下载文件：
```bash
curl -O <文件URL>
```

使用 wget 下载文件：
```bash
wget <文件URL>
```

解压 tar.gz 文件：
```bash
tar -xvzf <压缩包.tar.gz>
```

解压 zip 文件：
```bash
unzip <压缩包.zip>
```

## 📶 网络相关
查看 IP 地址：
```bash
ifconfig
```

查看网络连接：
```bash
netstat -tuln
```

SSH 连接远程服务器：
```bash
ssh user@host -p port
```

启动 SSH 服务（需先安装 openssh）：
```bash
sshd
```

## 🐍 开发环境
启动 Python 解释器：
```bash
python
```

安装 Python 包：
```bash
pip install <包名>
```

启动 Node.js：
```bash
node
```

安装 Node 包：
```bash
npm install <包名>
```

克隆 Git 仓库：
```bash
git clone <仓库URL>
```

添加文件到暂存区：
```bash
git add .
```

提交更改：
```bash
git commit -m "说明"
```

推送更改：
```bash
git push
```

## ⚡ 常用快捷键
```
音量+ + Q → 显示扩展键
音量+ + T → 新建标签页
音量+ + W → 关闭当前会话
音量+ + ←/→ → 切换标签页
Ctrl + C → 终止当前命令
Ctrl + D → 退出会话
```