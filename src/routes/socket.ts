import chalk from 'chalk'
import { Server } from 'socket.io'

export const socket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(chalk.bgCyan('user connected   ') + socket.id)
    socket.on('chat', (data) => {
      socket.emit('onChat', data)
      console.log(socket.id, 'send: ', data)
    })
    socket.on('disconnect', () => {
      console.log(chalk.bgGreenBright('user disconnected') + socket.id)
    })
  })
}
