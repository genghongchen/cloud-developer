import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { UpdateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger ('Update Todo Item')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
      logger.info("Processing event: " + event)

      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)

      await UpdateTodo(todoId, updatedTodo, userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
    } catch (e) {
      logger.error("Error: " + e.message)
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