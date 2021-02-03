import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { GenerateUploadUrl } from '../../businessLogic/todos'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';

const logger = createLogger ('Generate Upload URLs')

export const handler =  middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
      logger.info('Processing event: ', event)
      const todoId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
      const signedUploadUrl = await GenerateUploadUrl(todoId)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          uploadUrl: signedUploadUrl
        })
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
  cors({
    credentials: true
  })
)
