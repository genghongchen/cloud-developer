import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { GetTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger ('Get Todo Items')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  
    try{
      // TODO: Get all TODO items for a current user
      logger.info('Processing event: ', event)

      const userId = getUserId(event)
      const todos = await GetTodos(userId)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: todos
          })
        }
    } catch (e) {
      logger.error('Error: ' + e.message)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: e.message
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)