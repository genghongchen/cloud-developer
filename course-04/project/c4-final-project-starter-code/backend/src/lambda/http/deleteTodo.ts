import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { DeleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger("Update Todo Item")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: " + event)

  const todoId = event.pathParameters.todoId
  // TODO: Remove a TODO item by id
  const userId = getUserId(event)

  try {
    await DeleteTodo(todoId, userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  } catch (e){
    logger.error('Error: ' + e.message)

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },  
      body: e.message
    }
  }
}
