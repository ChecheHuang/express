import { TokenType, createToken, verifyToken } from '@/middleware/tokenMiddleware'
import prismadb from '@/utils/prismadb'
import { Router } from 'express'
import { z } from 'zod'
const authRouter = Router()

authRouter.post(
  '/login',
  /* 	#swagger.tags = ['身份驗證']
          #swagger.description = '登入' */
  async (req, res, next) => {
    const loginSchema = z.object({
      idNumber: z.string(),
      licensePlate: z.string(),
    })
    /*  #swagger.parameters['obj'] = {
                  in: 'body',
                  required: true,
                  schema: {
                            "idNumber": "idNumber",
                            "licensePlate": "licensePlate"
                          }
          } */
    try {
      const { idNumber, licensePlate } = loginSchema.parse(req.body)
      const user = await prismadb.user.findFirst({
        select: {
          id: true,
          account: true,
          password: true,
        },
        where: {
          account: 'account',
        },
      })
      if (!user) return res.status(404).json('查無此帳號')
      const token = createToken({
        id: user.id.toString(),
        account: user.account,
      })
      /* #swagger.responses[200] = { 
                  schema: {
                          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTQxMDE4MSwiZXhwIjoxNjk5NDk2NTgxfQ.xoQo1y31eHgSitufyGYS2H7GdEWAtLUHIGz5C5-FHIE",
                          "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTQxMDE4MSwiZXhwIjoxNzAwMDE0OTgxfQ.5qbB0UlM-e3CvQ1b1-bJ4ws55un91SdpyGFGyl7AfMM"
                        },
                   } */
      res.json(token)
    } catch (error: any) {
      next(error)
    }
  }
)
authRouter.post(
  '/refresh',
  /* 	#swagger.tags = ['身份驗證']
          #swagger.description = 'refresh_token' */
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      /*  #swagger.parameters['obj'] = {
                  in: 'body',
                  required: true,
                   schema: {
                            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTM0OTIwMywiZXhwIjoxNjk5OTU0MDAzfQ.xmf0wD6ObnqXRnBjPRuI344uuWxZvSGLU2o9b3kJZKE",
                          }
                 
          } */
      const decoded = await verifyToken(refreshToken)
      const token = createToken(decoded as TokenType)
      /* #swagger.responses[200] = { 
                  schema: {
                            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTQxMDg2MCwiZXhwIjoxNjk5NDEwODYzfQ.Kp9vFDgf1yYODyo0PP2OdgTi5loVdZUh3sviOhtAfTI",
                            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTQxMDg2MCwiZXhwIjoxNzAwMDE1NjYwfQ.Tr8GNlugJDZn-06O_ZTWkohv-l-M4UgeZM5NntvjWu0"
                          },
                   } */
      res.json(token)
    } catch (error) {
      console.log(error)
      res.status(401).json('請重新登入')
    }
  }
)

export default authRouter
