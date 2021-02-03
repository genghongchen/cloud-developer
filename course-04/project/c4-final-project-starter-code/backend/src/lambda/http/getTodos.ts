import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { GetTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger ('Get Todo Items')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  
  try{
    // TODO: Get all TODO items for a current user
    logger.info('Processing event: ', event)

    const userId = getUserId(event)
    const todos = await GetTodos(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
}
