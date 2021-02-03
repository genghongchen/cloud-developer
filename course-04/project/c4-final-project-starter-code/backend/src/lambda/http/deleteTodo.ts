import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { DeleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger("Update Todo Item")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: " + event)

    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)

    try {
      await DeleteTodo(todoId, userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
    } catch (e){
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
  cors ({
    credentials: true
  })
)
