/*
 * @Author: isboyjc
 * @Date: 2020-02-18 16:13:15
 * @LastEditors: Evany
 * @LastEditTime: 2020-06-12 14:17:18
 * @Description: 配置项
 */

module.exports = {
  // puppet_padplus Token
  token: "puppet_padplus_xxxxxxxxxxxxxxx",
  // 机器人名字
  name: "xx",
  // 房间/群聊
  room: {
    // 管理群组列表
    roomList: {
      // 白名单群拥有一切权限
      // 群名：群id
      whiteRoom: {
        "床前明月光": "225660@chatroom",
        "疑是地上霜": "10546262493@chatroom"
      },
      // 灰名单群仅支持指定用户@触发
      grayRoom: {
        "举头望明月": "12s933473@chatroom",
        "低头思故乡": "124756676@chatroom"
      }
    },
    // 加入房间回复
    roomJoinReply: `\n 热烈欢迎新同学的加入~~~`
  },
  // 管理人备注
  myLord: ["Evany", "Katy", "Kimson"],
  // 收到非文本消息时 随机回复一个
  textEmoji: ["..+'(◕ฺω◕ฺ）..+*",
              "（ ☉ω☉）",
              "(　♡ω♡)　",
              "(◕ฺω◕ฺ｀*)",
              "(◕ฺω◕ฺ)",
              "（♉ω♉ฺ）",
              "(♛ฺω♛ฺ)",
              "(♥'ω’♥ฺ）",
              "(✪ฺ￫ω￩✪ฺ)",
              "(✪ฺω✪ฺ）",
              "(✿◕ ω◕ฺ)ﾉ",
              "(థωథ。) ﾌﾞﾊｯ ）",
              "(ゝω・✿ฺ)",
              "ｄ(ゝω◕✿ฺ）",
              "(｡◕ฺˇω ˇ◕ฺ｡）",
              "ヾ（*◕ω◕*）ｼ♪",
              "(｡▻ฺω◕ฺ）",
              "ヾ(◕ฺω◕✿ ฺ）",
              "ヾ(◨ฺω◨✿ฺ ）",
              "ヾ(✿✪ฺ ω✪ฺ）ﾉ",
  ]
}
