import { io } from '@/server'
import { Handler } from 'express'
import { Server } from 'socket.io'
declare global {
  namespace Express {
    interface Response {
      io?: Server
    }
  }
}

const socketMiddleware: Handler = async (req, res, next) => {
  res.io = io
  next()
}

export default socketMiddleware
