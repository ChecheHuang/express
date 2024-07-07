import { PORT } from '@/config'
import { catchErrorMiddleware } from '@/middleware/catchErrorMiddleware'
import { logMiddleware } from '@/middleware/logMiddleware'
import apiRouter from '@/routes/index'
import swaggerDocument from '@/swagger.json'
import { getLocalIP } from '@/utils/utils'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
export const SERVER_ADDRESS = `http://${getLocalIP()}:${PORT}`
async function startServer() {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())

  const aaa = 123

  app.use(logMiddleware)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.use('/api', apiRouter)

  app.use(catchErrorMiddleware)

  const publicPath = path.join(path.resolve(__dirname, '..'), '/public')
  app.use(express.static(publicPath))
  app.get('/*', function (req, res) {
    // #swagger.ignore = true
    res.sendFile(path.join(publicPath, 'index.html'))
  })

  app.use((req: Request, res: Response, next: NextFunction) => next(createError(404, 'Endpoint not found')))

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log('----------------------------------------------------------------')
    console.error(err)
    let errorMessage = 'An unknown error occurred: '
    let statusCode = 500
    if (err instanceof createError.HttpError) {
      statusCode = err.status
      errorMessage = err.message
    }
    res.status(statusCode).json({ error: errorMessage })
  })

  app.listen(PORT, () => {
    console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}`))
    console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}/api-docs`))
  })
}
startServer()
