/*
 * @Author: isboyjc
 * @Date: 2020-02-18 16:26:41
 * @LastEditors: Evany
 * @LastEditTime: 2020-06-12 14:17:18
 * @Description: 机器人需要扫描二维码时监听
 */
const Qrterminal = require("qrcode-terminal")
const {
  ScanStatus,
  log,
}               = require('wechaty')

// module.exports = function onScan(qrcode, status) {
//   Qrterminal.generate(qrcode, { small: true })
// }
module.exports = function onScan (qrcode, status) {

  Qrterminal.generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  log.info('StarterBot', 'onScan: %s', qrcodeImageUrl)
}