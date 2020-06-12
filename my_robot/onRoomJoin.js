/*
 * @Author: isboyjc
 * @Date: 2020-02-18 16:22:41
 * @LastEditors: Evany
 * @LastEditTime: 2020-06-12 14:17:18
 * @Description: 进入房间监听回调
 */

// 配置文件
const config = require("./config")
// 加入房间回复
const roomJoinReply = config.room.roomJoinReply
// 白名单群组列表
const whtieRoomList = config.room.roomList.whiteRoom
// 灰名单群组列表
const grayRoomList = config.room.roomList.grayRoom
// 所有群组列表
const allRoomList = {...whtieRoomList, ...grayRoomList}

// 进入房间监听回调 room-群聊 inviteeList-受邀者名单 inviter-邀请者
module.exports = async function onRoomJoin(room, inviteeList, inviter) {
  // 判断配置项群组id数组中是否存在该群聊id
  if (Object.values(allRoomList).some(v => v == room.id)) {
  	console.log(`hitRoom: ${room}`)
  	console.log(`hitRoomId: ${room.id}`)
  	console.log(`inviter: ${inviter}`)
  	console.log(`inviteeList: ${inviteeList}`)
    // let roomTopic = await room.topic()
    inviteeList.map(c => {
      // 发送消息并@
      room.say(roomJoinReply, c)
      console.log("=============================")
    })
  }
}
