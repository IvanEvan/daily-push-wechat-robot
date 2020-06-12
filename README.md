# 微信每日推送自动化机器人

------

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

**基于 wechaty 的微信机器人助手**

------

#### 具备功能

**0. 静态网页爬取**

​    0.1 每天定时从"微博"相关公众号主页爬取当日资讯

**1. 关键词触发功能**

​    1.1 关键词"介绍一下自己"、 "自我介绍一下"、 "你是谁"触发自我介绍

​    1.2 关键词“推送”触发咨询推送，内容为前一日资讯

​    1.3 地名+天气  触发天气查询

**2. 群外聊天（好友一对一）**

​    2.1 功能1全部具备

​    2.2 自动回复文本消息

​    2.3 图片、视频、表情包、链接、撤回等非文本消息随机回复颜文字

**3. 群内聊天（机器人一对多）**

​     3.1 白名单群

​     功能如同 1、2，

​     群内成员皆有聊天权限，可 “@bot” 触发，也可直接对话，

​     不会回复 @其他群成员 的消息

​     3.2 灰名单群

​     功能如 3.1，但权限有别，仅由指定管理人触发，且必须通过 “@bot”

​     3.3 入群欢迎词

------

#### 文档结构

```
│  │      
│  │     README.md  # 本文件
│  │
│  ├─pull_message
│  │      pull_data_from_weibo.py  # 静态抓取资讯
│  │
│  ├─message_warehouse
│  │      push_me_2020-06-11.txt  # 抓取资讯样例 日期为前一天日期
│  │
│  │─my_robot
│  │      bot.js  # 机器人主程序 
│  │      config.js  # 配置文件 补充自己的信息
│  │      onMessage.js  # 主要对话逻辑
│  │      onRoomJoin.js  # 进群欢迎程序
│  │      onScan.js  #  扫码登录程序
│  │ 
```

------

#### 运行

> **目前仅在 windows 系统运行成功**

**0. 运行前必看**

​	0.1 本人将使用过程中的坑做了总结

​		   在使用前建议先阅读一下

​           博客： [打通微信的最后一堵墙----基于Wechaty的微信机器人](https://zhuanlan.zhihu.com/p/146660604)

**1. 资讯抓取**

​	1.1 安装 anaconda 环境（略过）

​	1.2 部署定时任务

​		使用 windows 自带的“**任务计划程序**”部署

​		参考：[Windows如何通过Anaconda定时调用python脚本](https://zhuanlan.zhihu.com/p/50057040)

**2. 运行机器人**

​	2.1 安装配置环境

​		参考：[wecahty 官方文档](https://github.com/wechaty/wechaty-puppet-padplus) 

​		按照文档正常走完前三步就够了

​	2.2 运行机器人

​		推荐用 **PowerShell** 以管理员身份启动一个终端

```
PS daily-push-wechat-robot\my_robot> node .\bot.js
```

​		扫码即可登录，所有日志均在终端内打印

------

#### 其他

本项目主要实现按关键词指令发送信息，闲聊接用的为[小思机器人](https://www.ownthink.com/)

need-to-do：提醒监听、A 指令触发 bot 通信 B ......