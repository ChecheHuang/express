import tokenMiddleware from '@/middleware/tokenMiddleware'
import prismadb from '@/utils/prismadb'
import { catchError } from '@/utils/utils'
import { Router } from 'express'
const todoRouter = Router()

todoRouter.get(
  '/',
  /* 	#swagger.tags = ['Todo']
  #swagger.description = '獲取全部' */
  async (req, res, next) => {
    const todos = await prismadb.todo.findMany({
      select: {
        id: true,
        title: true,
        status: true,
      },
    })
    /* #swagger.responses[200] = { 
                  schema: [
                            {
                              "id": 1,
                              "title": "todo1",
                              "content": "content",
                              "status": false
                            },
                            {
                              "id": 2,
                              "title": "todo2",
                              "content": "content2",
                              "status": false
                            }
                          ],
                   } */

    res.io?.emit('onChat', '123')
    res.json(todos)
  }
)
todoRouter.post(
  '/',
  /* 	#swagger.tags = ['Todo']
          #swagger.description = '新增' */ async (req, res, next) => {
    const { title, content } = req.body
    /*  #swagger.parameters['obj'] = {
                  in: 'body',
                  required: true,
                  schema: {
                            "title": "title",
                          }
          } */
    const todo = await prismadb.todo.create({
      data: {
        title,
        content,
      },
    })
    res.json(todo)
  }
)
todoRouter.get(
  '/:id',
  /* 	#swagger.tags = ['Todo']
          #swagger.description = '獲取' */
  async (req, res, next) => {
    const { id } = req.params
    //  #swagger.parameters['id'] = { description: 'todo id' }
    const todo = await prismadb.todo.findUnique({
      where: {
        id: Number(id),
      },
    })

    res.json(todo)
  }
)
todoRouter.put(
  '/:id',
  /* 	#swagger.tags = ['Todo']
          #swagger.description = '修改' */ catchError(async (req, res, next) => {
    const { id } = req.params
    //  #swagger.parameters['id'] = { description: 'todo id' }
    const { title, content, status } = req.body
    /*  #swagger.parameters['obj'] = {
                  in: 'body',
                  required: true,
                  schema: {
                            "title": "title",
                            "content": "content",
                            "status": false
                          }
          } */
    const todo = await prismadb.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        status,
      },
    })
    res.json(todo)
  })
)
todoRouter.delete(
  '/:id',
  /* 	#swagger.tags = ['Todo']
#swagger.description = '刪除' */
  tokenMiddleware,
  /* #swagger.security = [{
          "apiKeyAuth": []
  }] */
  catchError(async (req, res, next) => {
    const { id } = req.params
    //  #swagger.parameters['id'] = { description: 'todo id' }
    const todo = await prismadb.todo.delete({
      where: {
        id: Number(id),
      },
    })
    res.json(todo)
  })
)

export default todoRouter
