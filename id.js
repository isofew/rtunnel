var logger = require('logplease').create('rtunnel')
var rand = require('crypto').randomBytes
const len = 16

module.exports = {
  len: len,
  gen: () => rand(len),
  dispense: (data, next) => {
    if (data.length < len) {
      logger.error('websocket message too short')
      return
    }
    var id = data.slice(0, len)
    data = data.slice(len)
    next(id, data)
  },
  bind: (id, wSocket, socket) => {
    wSocket.on(id, data => {
      if (data.length) {
        try {
          socket.write(data)
        }
        catch(e) {
          logger.error('socket.write(data)' + e.toString())
        }
      }
      else socket.destroy()
    })
    socket.on('data', data => {
      try {
        wSocket.send(Buffer.concat([id, data]))
      }
      catch (e) {
        logger.error('wSocket.send(id, data)', e.toString())
      }
    })
    socket.on('end', () => {
      try {
        wSocket.send(id)
      }
      catch (e) {
        logger.error('wSocket.send(id)', e.toString())
      }
    })
  },
}
