import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { CreateTodo } from '../../businessLogic/todos'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils'

const logger = createLogger ('Create Todo Item')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
      logger.info('Processing event: ', event)

      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)

      // TODO: Implement creating a new TODO item
      const newItem = await CreateTodo(newTodo, userId)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          newItem
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