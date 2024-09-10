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

  app.use(logMiddleware)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.post(
    '/api/manage/user/report/trend',
    /* 	#swagger.tags = ['data-overview']
          #swagger.description = '获取用户趋势报表' */ (req, res) => {
      /*  #swagger.parameters['obj'] = {
                  in: 'body',
                  required: true,
                  schema: {
                            "startTime": 1725120000000,
                            "endTime": 1725552000000,
                            "platform": -1,
                          }
          } */
      const { startTime, endTime, platform = -1 } = req.body
      const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return parseInt(`${year}${month}${day}`)
      }
      const createRandom = () => Math.floor(Math.random() * 1000)

      const startDate = formatDate(startTime)
      const endDate = formatDate(endTime)

      const createArr = (stringArr: string[]) => {
        return new Array(endDate - startDate + 1).fill(0).map((_, i) => {
          const obj: any = {
            dateInt: startDate + i,
          }
          for (const i of stringArr) {
            obj[i] = createRandom()
          }
          return obj
        })
      }
      const createRandomRate = () => {
        return parseFloat((Math.random() * 2 - 1).toFixed(2))
      }

      console.log(startDate, endDate)

      const createData = () => {
        const flows = createArr(['firstVisitorCount', 'totalVisitorCount'])
        const registers = createArr(['registerConversionRate', 'registerCount'])
        const retentions = createArr(['userRetentionRate', 'visitorRetentionRate'])
        const users = createArr(['userCount', 'visitorCount'])
        const riseAndFall = {
          firstVisitor: {
            changeRate: createRandomRate(),
            count: createRandom(),
          },
          register: {
            changeRate: createRandomRate(),
            count: createRandom(),
          },
          registerConversion: {
            changeRate: createRandomRate(),
            rate: createRandom(),
          },
          totalVisitor: {
            changeRate: createRandomRate(),
            count: createRandom(),
          },
          user: {
            changeRate: createRandomRate(),
            count: createRandom(),
          },
          userRetention: {
            changeRate: createRandomRate(),
            rate: createRandom(),
          },
          visitor: {
            changeRate: createRandomRate(),
            count: createRandom(),
          },
          visitorRetention: {
            changeRate: createRandomRate(),
            rate: createRandom(),
          },
        }
        return {
          flows,
          registers,
          retentions,
          users,
          riseAndFall,
        }
      }

      const total = createData()
      const pc = createData()
      const h5 = createData()

      const response = {
        code: 1,
        data: {
          h5,
          pc,
          total,
        },
        keyConfig: null,
        languagePassVal: null,
        message: 'SUCCESS',
      }
      console.cuslog(response)
      return res.json(response)

      if (platform === 0) {
        return res.json({
          code: 1,
          data: {
            pc,
            h5: null,
            total: null,
          },
          keyConfig: null,
          languagePassVal: null,
          message: 'SUCCESS',
        })
      }
      if (platform === 1) {
        return res.json({
          code: 1,
          data: {
            h5,
            pc: null,
            total: null,
          },
          keyConfig: null,
          languagePassVal: null,
          message: 'SUCCESS',
        })
      }

      /* #swagger.responses[200] = { 
                  schema: {
  "code": 1,
  "data": {
    "h5": {
      "flows": [
        {
          "dateInt": 20240901,
          "firstVisitorCount": 262,
          "totalVisitorCount": 176
        },
        {
          "dateInt": 20240902,
          "firstVisitorCount": 741,
          "totalVisitorCount": 163
        },
        {
          "dateInt": 20240903,
          "firstVisitorCount": 381,
          "totalVisitorCount": 749
        },
        {
          "dateInt": 20240904,
          "firstVisitorCount": 453,
          "totalVisitorCount": 701
        },
        {
          "dateInt": 20240905,
          "firstVisitorCount": 405,
          "totalVisitorCount": 706
        },
        {
          "dateInt": 20240906,
          "firstVisitorCount": 393,
          "totalVisitorCount": 649
        }
      ],
      "registers": [
        {
          "dateInt": 20240901,
          "registerConversionRate": 455,
          "registerCount": 66
        },
        {
          "dateInt": 20240902,
          "registerConversionRate": 998,
          "registerCount": 403
        },
        {
          "dateInt": 20240903,
          "registerConversionRate": 75,
          "registerCount": 57
        },
        {
          "dateInt": 20240904,
          "registerConversionRate": 363,
          "registerCount": 284
        },
        {
          "dateInt": 20240905,
          "registerConversionRate": 813,
          "registerCount": 520
        },
        {
          "dateInt": 20240906,
          "registerConversionRate": 731,
          "registerCount": 79
        }
      ],
      "retentions": [
        {
          "dateInt": 20240901,
          "userRetentionRate": 306,
          "visitorRetentionRate": 603
        },
        {
          "dateInt": 20240902,
          "userRetentionRate": 967,
          "visitorRetentionRate": 414
        },
        {
          "dateInt": 20240903,
          "userRetentionRate": 65,
          "visitorRetentionRate": 328
        },
        {
          "dateInt": 20240904,
          "userRetentionRate": 321,
          "visitorRetentionRate": 8
        },
        {
          "dateInt": 20240905,
          "userRetentionRate": 987,
          "visitorRetentionRate": 398
        },
        {
          "dateInt": 20240906,
          "userRetentionRate": 129,
          "visitorRetentionRate": 104
        }
      ],
      "users": [
        {
          "dateInt": 20240901,
          "userCount": 172,
          "visitorCount": 843
        },
        {
          "dateInt": 20240902,
          "userCount": 39,
          "visitorCount": 669
        },
        {
          "dateInt": 20240903,
          "userCount": 730,
          "visitorCount": 162
        },
        {
          "dateInt": 20240904,
          "userCount": 350,
          "visitorCount": 800
        },
        {
          "dateInt": 20240905,
          "userCount": 400,
          "visitorCount": 370
        },
        {
          "dateInt": 20240906,
          "userCount": 846,
          "visitorCount": 756
        }
      ],
      "riseAndFall": {
        "firstVisitor": {
          "changeRate": -0.67,
          "count": 281
        },
        "register": {
          "changeRate": 0.31
        },
        "registerConversion": {
          "changeRate": -0.41,
          "rate": 362
        },
        "totalVisitor": {
          "changeRate": 0.91,
          "count": 878
        },
        "user": {
          "changeRate": -0.01,
          "count": 926
        },
        "userRetention": {
          "changeRate": 0.03,
          "rate": 836
        },
        "visitor": {
          "changeRate": -0.26,
          "count": 8
        },
        "visitorRetention": {
          "changeRate": -0.01,
          "rate": 418
        }
      }
    },
    "pc": {
      "flows": [
        {
          "dateInt": 20240901,
          "firstVisitorCount": 262,
          "totalVisitorCount": 176
        },
        {
          "dateInt": 20240902,
          "firstVisitorCount": 741,
          "totalVisitorCount": 163
        },
        {
          "dateInt": 20240903,
          "firstVisitorCount": 381,
          "totalVisitorCount": 749
        },
        {
          "dateInt": 20240904,
          "firstVisitorCount": 453,
          "totalVisitorCount": 701
        },
        {
          "dateInt": 20240905,
          "firstVisitorCount": 405,
          "totalVisitorCount": 706
        },
        {
          "dateInt": 20240906,
          "firstVisitorCount": 393,
          "totalVisitorCount": 649
        }
      ],
      "registers": [
        {
          "dateInt": 20240901,
          "registerConversionRate": 455,
          "registerCount": 66
        },
        {
          "dateInt": 20240902,
          "registerConversionRate": 998,
          "registerCount": 403
        },
        {
          "dateInt": 20240903,
          "registerConversionRate": 75,
          "registerCount": 57
        },
        {
          "dateInt": 20240904,
          "registerConversionRate": 363,
          "registerCount": 284
        },
        {
          "dateInt": 20240905,
          "registerConversionRate": 813,
          "registerCount": 520
        },
        {
          "dateInt": 20240906,
          "registerConversionRate": 731,
          "registerCount": 79
        }
      ],
      "retentions": [
        {
          "dateInt": 20240901,
          "userRetentionRate": 306,
          "visitorRetentionRate": 603
        },
        {
          "dateInt": 20240902,
          "userRetentionRate": 967,
          "visitorRetentionRate": 414
        },
        {
          "dateInt": 20240903,
          "userRetentionRate": 65,
          "visitorRetentionRate": 328
        },
        {
          "dateInt": 20240904,
          "userRetentionRate": 321,
          "visitorRetentionRate": 8
        },
        {
          "dateInt": 20240905,
          "userRetentionRate": 987,
          "visitorRetentionRate": 398
        },
        {
          "dateInt": 20240906,
          "userRetentionRate": 129,
          "visitorRetentionRate": 104
        }
      ],
      "users": [
        {
          "dateInt": 20240901,
          "userCount": 172,
          "visitorCount": 843
        },
        {
          "dateInt": 20240902,
          "userCount": 39,
          "visitorCount": 669
        },
        {
          "dateInt": 20240903,
          "userCount": 730,
          "visitorCount": 162
        },
        {
          "dateInt": 20240904,
          "userCount": 350,
          "visitorCount": 800
        },
        {
          "dateInt": 20240905,
          "userCount": 400,
          "visitorCount": 370
        },
        {
          "dateInt": 20240906,
          "userCount": 846,
          "visitorCount": 756
        }
      ],
      "riseAndFall": {
        "firstVisitor": {
          "changeRate": -0.67,
          "count": 281
        },
        "register": {
          "changeRate": 0.31
        },
        "registerConversion": {
          "changeRate": -0.41,
          "rate": 362
        },
        "totalVisitor": {
          "changeRate": 0.91,
          "count": 878
        },
        "user": {
          "changeRate": -0.01,
          "count": 926
        },
        "userRetention": {
          "changeRate": 0.03,
          "rate": 836
        },
        "visitor": {
          "changeRate": -0.26,
          "count": 8
        },
        "visitorRetention": {
          "changeRate": -0.01,
          "rate": 418
        }
      }
    },
    "total": {
      "flows": [
        {
          "dateInt": 20240901,
          "firstVisitorCount": 262,
          "totalVisitorCount": 176
        },
        {
          "dateInt": 20240902,
          "firstVisitorCount": 741,
          "totalVisitorCount": 163
        },
        {
          "dateInt": 20240903,
          "firstVisitorCount": 381,
          "totalVisitorCount": 749
        },
        {
          "dateInt": 20240904,
          "firstVisitorCount": 453,
          "totalVisitorCount": 701
        },
        {
          "dateInt": 20240905,
          "firstVisitorCount": 405,
          "totalVisitorCount": 706
        },
        {
          "dateInt": 20240906,
          "firstVisitorCount": 393,
          "totalVisitorCount": 649
        }
      ],
      "registers": [
        {
          "dateInt": 20240901,
          "registerConversionRate": 455,
          "registerCount": 66
        },
        {
          "dateInt": 20240902,
          "registerConversionRate": 998,
          "registerCount": 403
        },
        {
          "dateInt": 20240903,
          "registerConversionRate": 75,
          "registerCount": 57
        },
        {
          "dateInt": 20240904,
          "registerConversionRate": 363,
          "registerCount": 284
        },
        {
          "dateInt": 20240905,
          "registerConversionRate": 813,
          "registerCount": 520
        },
        {
          "dateInt": 20240906,
          "registerConversionRate": 731,
          "registerCount": 79
        }
      ],
      "retentions": [
        {
          "dateInt": 20240901,
          "userRetentionRate": 306,
          "visitorRetentionRate": 603
        },
        {
          "dateInt": 20240902,
          "userRetentionRate": 967,
          "visitorRetentionRate": 414
        },
        {
          "dateInt": 20240903,
          "userRetentionRate": 65,
          "visitorRetentionRate": 328
        },
        {
          "dateInt": 20240904,
          "userRetentionRate": 321,
          "visitorRetentionRate": 8
        },
        {
          "dateInt": 20240905,
          "userRetentionRate": 987,
          "visitorRetentionRate": 398
        },
        {
          "dateInt": 20240906,
          "userRetentionRate": 129,
          "visitorRetentionRate": 104
        }
      ],
      "users": [
        {
          "dateInt": 20240901,
          "userCount": 172,
          "visitorCount": 843
        },
        {
          "dateInt": 20240902,
          "userCount": 39,
          "visitorCount": 669
        },
        {
          "dateInt": 20240903,
          "userCount": 730,
          "visitorCount": 162
        },
        {
          "dateInt": 20240904,
          "userCount": 350,
          "visitorCount": 800
        },
        {
          "dateInt": 20240905,
          "userCount": 400,
          "visitorCount": 370
        },
        {
          "dateInt": 20240906,
          "userCount": 846,
          "visitorCount": 756
        }
      ],
      "riseAndFall": {
        "firstVisitor": {
          "changeRate": -0.67,
          "count": 281
        },
        "register": {
          "changeRate": 0.31
        },
        "registerConversion": {
          "changeRate": -0.41,
          "rate": 362
        },
        "totalVisitor": {
          "changeRate": 0.91,
          "count": 878
        },
        "user": {
          "changeRate": -0.01,
          "count": 926
        },
        "userRetention": {
          "changeRate": 0.03,
          "rate": 836
        },
        "visitor": {
          "changeRate": -0.26,
          "count": 8
        },
        "visitorRetention": {
          "changeRate": -0.01,
          "rate": 418
        }
      }
    }
  },
  "keyConfig": null,
  "languagePassVal": null,
  "message": "SUCCESS"
},
                   } */
    }
  )

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
