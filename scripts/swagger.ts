import swaggerAutogen from 'swagger-autogen'
import { PORT } from '../src/config'

const doc = {
  info: {
    title: 'My API',
    description:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6IuaIkeaYr-WNlOeQhiIsImlhdCI6MTY5OTM0MzQwMH0.4Zjlpgj7hMjTGZALRolpL46dN--ExyuxqJrp4xKWREc',
  },
  host: `localhost:${PORT || 8080}`,
  //   basePath: '/api',
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'Some description...',
    },
  },
  definitions: {},
}

const outputFile = '../src/swagger.json'
const endpointsFiles = ['../src/server.ts']

swaggerAutogen(outputFile, endpointsFiles, doc)
