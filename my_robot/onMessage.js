/*
 * @Author: isboyjc
 * @Date: 2020-02-18 16:31:25
 * @LastEditors: Evany
 * @LastEditTime: 2020-06-12 14:17:18
 * @Description: 消息监听回调
 */
const { Message } = require("wechaty")
// node-request请求模块包
const request = require("request")
// 请求参数解码
const urlencode = require("urlencode")
// path 包
const path = require('path')
// 配置文件
const config = require("./config")
// 机器人名字
const name = config.name
// 颜文字数组
const textEmojiList = config.textEmoji
// 白名单群组列表
const whtieRoomList = Object.keys(config.room.roomList.whiteRoom)
// 灰名单群组列表
const grayRoomList = Object.keys(config.room.roomList.grayRoom)
// 权限管理员列表
const myLordList = config.myLord
// 文件系统模块
const fs = require("fs")

// 消息监听回调
module.exports = bot => {
  return async function onMessage(msg) {
    // 判断消息来自自己，直接return
    if (msg.self()) return

    console.log("=============================")
    console.log(`msg : ${msg}`)
    console.log(
      `from: ${msg.from() ? msg.from().name() : null}: ${
        msg.from() ? msg.from().id : null
      }`
    )
    
    console.log(`from备注: ${msg.from()}`)
    console.log(`from昵称: ${msg.from().name()}`)
    console.log(`from微信号wxid: ${msg.from().id}`)
    console.log(`to: ${msg.to()}`)
    console.log(`text: ${msg.text()}`)
    console.log(`isRoom: ${msg.room()}`)
    //  Contact<备注>
    const remark = await msg.from()
    const fromRemark = remark.toString().replace(/^Contact</g, "").replace(/>$/g, "")

    // 判断消息类型来自群聊
    // 群聊中 @ 和 非文字信息 不能同时发出，因此不考虑图片、表情干扰
    if (msg.room()) {
      // 获取群名
      const room = await msg.room()
      const nowRoom = room.toString().replace(/^Room</g, "").replace(/>$/g, "")
      console.log(`inRoom: ${nowRoom}`)
      console.log(`isRoomID: ${msg.room().id}`)

      // 收到消息，@ 提到自己 回复消息并 @ 回去
      if (await msg.mentionSelf()) {
        // 获取提到自己的名字
        let self = await msg.to()
        self = "@" + self.name()
        console.log(`inRoom@Bot: ${self}`)
        
        // 中了白名单随便聊
        if (await whtieRoomList.indexOf(nowRoom) > -1) {
          console.log(`hitWhiteRoom: ${nowRoom}`)

          // 获取消息内容，拿到整个消息文本，去掉 @+名字 以及 空格 以及换行符 以及 引用
          let sendText = msg.text().replace(self, "").replace(/\s+/g, "").replace(/[\n\r]/g, "").replace(/.*---------------/g, "")

          console.log(`receiveMsg: ${sendText}`)
          // 回复信息是推送内容
          if (await isPushNews(msg, sendText)) return

          // 回复信息是自我介绍内容
          if (await isSelfIntroduction(msg, sendText)) return

          // 请求机器人接口回复
          let res = await requestRobot(sendText)

          // 返回消息，并@来自人
          await room.say(res, msg.from())
          
          console.log(`sendMsg: ${res}`)
          console.log("=============================")
          return
        }

        // 中了灰名单
        if (grayRoomList.indexOf(nowRoom) > -1) {
          console.log(`hitGrayRoom: ${nowRoom}`)

          // 中了指定管理员
          if (myLordList.indexOf(fromRemark) > -1) {
            // 获取消息内容，拿到整个消息文本，去掉 @+名字 以及 空格 以及换行符 以及 引用
            let sendText = msg.text().replace(self, "").replace(/\s+/g, "").replace(/[\n\r]/g, "").replace(/.*---------------/g, "")

            console.log(`receiveMsg: ${sendText}`)
            // 回复信息是推送内容
            if (await isPushNews(msg, sendText)) return

            // 回复信息是自我介绍内容
            if (await isSelfIntroduction(msg, sendText)) return

            // 请求机器人接口回复
            let res = await requestRobot(sendText)

            // 返回消息，并@来自人
            await room.say(res, msg.from())
            
            console.log(`sendMsg: ${res}`)
            console.log("=============================")
            return

          // 未中指定管理员
          } else {
            let res = "我是个木有感情的机器人，请不要骚扰我。"
            await room.say(res, msg.from())
            
            console.log(`sendMsg: ${res}`)
            console.log("=============================")
            return
          }
        }
        // 没中名单的群聊不处理
      
      // 收到消息，没有 @ 提到自己 判断是否在 开放的群里 是就随意回复 不在就不操作
      } else {
        console.log(`inRoomNo@Bot: ${nowRoom}`)
        // 命中白名单
        if (whtieRoomList.indexOf(nowRoom) > -1) {
          console.log(`hitWhiteRoom: ${nowRoom}`)

          // 不包含 @ 字符
          if (msg.text().indexOf('@') == -1) {
            
            // 消息为文本
            if (msg.type() == Message.Type.Text) {
              console.log(`inRoomNo@OtherIsText: ${nowRoom}`)
              // 获取消息内容，拿到整个消息文本，去掉 空格 以及换行符 以及 引用
              let sendText = msg.text().replace(/\s+/g, "").replace(/[\n\r]/g, "").replace(/.*---------------/g, "")

              console.log(`receiveMsg: ${sendText}`)
              // 回复信息是推送内容
              if (await isPushNews(msg, sendText)) return

              // 回复信息是自我介绍内容
              if (await isSelfIntroduction(msg, sendText)) return

              // 请求机器人接口回复
              let res = await requestRobot(sendText)

              // 返回消息
              await msg.say(res)
        
              console.log(`sendMsg: ${res}`)
              console.log("=============================")
              return
            } else {
              // 非文本回复颜文字
              console.log(`inRoomNo@OtherNoText: ${nowRoom}`)
              console.log(`receiveMsg: ${msg.text()}`)
              // 随机去一个表情
              let index = Math.floor((Math.random() * textEmojiList.length))
              // 发送消息
              await msg.say(textEmojiList[index])
              
              console.log(`sendMsg: ${textEmojiList[index]}`)
              console.log("=============================")
              return
            }

          // 包含 @ 字符
          } else {

            // 消息长度小于 100 即为表情  随机回复颜文字
            if (msg.text().length > 100) {
              // 非文本回复颜文字
              console.log(`inRoomNo@OtherNoText: ${nowRoom}`)
              console.log(`receiveMsg: ${msg.text()}`)
              // 随机去一个表情
              let index = Math.floor((Math.random() * textEmojiList.length))
              // 发送消息
              await msg.say(textEmojiList[index])
              
              console.log(`sendMsg: ${textEmojiList[index]}`)
              console.log("=============================")
              return

            // 消息长度小于 100 即为@他人  不处理
            } else {
              console.log(`inRoom@Other: ${nowRoom}`)
            }
          } 
        }
        // 除白名单外的群聊不处理 
      }

    // 判断消息类型来自指定好友（避免权限泄露，机器人和所有好友对话）
    } else {
      console.log(`outRoom: ${msg.from()}`)
      // 指定用户私聊
      if (myLordList.indexOf(fromRemark) > -1) {

        // 收到消息是文本
        if (msg.type() == Message.Type.Text) {
          // 获取消息内容，拿到整个消息文本，去掉 空格 以及换行符 以及 引用
          let sendText = msg.text().replace(/\s+/g, "").replace(/[\n\r]/g, "").replace(/.*---------------/g, "")

          console.log(`outRoomIsText: ${msg.from()}`)
          console.log(`receiveMsg: ${sendText}`)
          // 回复信息是推送内容
          if (await isPushNews(msg, sendText)) return

          // 回复信息是自我介绍内容
          if (await isSelfIntroduction(msg, sendText)) return
            
          // 请求机器人聊天接口
          let res = await requestRobot(sendText)

          // 返回聊天接口内容
          await msg.say(res)

          console.log(`sendMsg: ${res}`)
          console.log("=============================")
          return
        // 不是文本消息
        } else {
          // 非文本回复颜文字
          console.log(`outRoomNoText: ${msg.from()}`)
          console.log(`receiveMsg: ${msg.text()}`)
          // 随机去一个表情
          let index = Math.floor((Math.random() * textEmojiList.length))
          // 发送消息
          await msg.say(textEmojiList[index])
          
          console.log(`sendMsg: ${textEmojiList[index]}`)
          console.log("=============================")
          return
        } 
      }
    }
    console.log("=============================")
  }
}

/**
 * @description 回复信息是关键字 “推送” 处理函数
 * @param {Object} msg 消息对象
 * @param {String} text 消息文本
 * @return {Promise} true-是 false-不是
 */
async function isPushNews(msg, text) {

  // 关键字 推送 处理
  if (text == "推送") {

    // 获取日期对象
    let d = new Date()

    // 切换到昨天
    d.setTime(d.getTime()- 24 * 60 * 60 * 1000)

    // 获取昨天的 年
    let nowYear = d.getFullYear() 
    
    // 获取昨天的 月
    let month = (d.getMonth() + 1).toString()
    if (month.length < 2) {
      var nowMonth = `0${month}`
    } else {
      var nowMonth = month
    }

    // 获取昨天的 日
    let day = d.getDate().toString()
    if (day.length < 2) {
      var nowDay = `0${day}`
    } else {
      var nowDay = day
    } 
    
    // 昨天日期格式 YYYY-mm-dd
    let yesterday = nowYear + "-" + nowMonth + "-" + nowDay

    // 异步读取 爬取到的最新资讯
    fs.readFile(path.join('..\\message_warehouse', `push_me_${yesterday}.txt`), function (err, data) {
      if (err) {

        // 文件读取失败兜底回复
        msg.say('喂喂喂，机器人也是要休息的哟喂，哼哼╭(╯^╰)╮')
        return console.error(err)
      }

      // 待发送内容
      let info = `${data.toString()}`

      // 内容短于 60 个字符，即只有固定开场白信息，无资讯信息
      if (info.length < 60) {
        let info = '喂喂喂，机器人也是要休息的哟喂，哼╭(╯^╰)╮'

        // 资讯过短兜底回复
        msg.say(info)
      } else {

        // 发送资讯消息
        msg.say(info)
      }

      // 记录回复内容
      console.log(`sendMsg: ${info}`)
    })
    return true
  }
  return false
}

/**
 * @description 回复信息是关键字 “自我介绍” 处理函数
 * @param {Object} msg 消息对象
 * @param {String} text 消息文本
 * @return {Promise} true-是 false-不是
 */
async function isSelfIntroduction(msg, text) {

  // 关键字 自我介绍相关 数组
  let si = ["介绍一下自己", "自我介绍一下", "你是谁"]

  // 判断是否命中 介绍相关
  if (si.indexOf(text) > -1) {
    let prologue = `大噶猴啊，我叫xx，我是机器人界的后浪，以后就由我来给大家提供美味的“早餐”啦~`

    // 发送资讯消息
    msg.say(prologue)

    // 记录回复内容
    console.log(`sendMsg: ${prologue}`)
    return true
  }
  return false
}
  
/**
 * @description 机器人请求接口 处理函数
 * @param {String} info 发送文字
 * @return {Promise} 相应内容
 */
function requestRobot(info) {
  return new Promise((resolve, reject) => {
    // 小思机器人  appid 可以申请
    let url = `https://api.ownthink.com/bot?appid=xxxxxxxxx&userid=test&spoken=${urlencode(info)}`
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        try {
          var res = JSON.parse(body)
          var status = res.message
          console.log(`jsonObj: ${res}`)
        } catch (ee) {
          var status = "faild"
          console.log('捕获到json异常：', ee)
        }
        
        if (status == "success") {
          try {
            let send = res.data.info.text
            // 免费的接口，所以需要把机器人名字替换成为自己设置的机器人名字
            send = send.replace(/小思/g, name)
            resolve(send)
          } catch (e) {
            resolve("xx电量不足，正在切换替代版本“小牛”中......切换失败")
            console.log('捕获到text异常：', e)
          }
          
        } else {
          resolve("又说那话，有本事你换一句呀")
        }
      } else {
        resolve("喂喂喂，你们家网线不通畅，小随听不到你讲话")
      }
    })
  })
}
