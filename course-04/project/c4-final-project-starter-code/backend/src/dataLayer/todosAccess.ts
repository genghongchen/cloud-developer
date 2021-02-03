import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger(XAWS)

export class TodoAccess {
    constructor(
        private docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private todosTable = process.env.TODOS_TABLE,
        private s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private bucketName = process.env.IMAGES_S3_BUCKET,
        private urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) {
    }

    async GetTodos (userId: string): Promise<TodoItem[]>{
      logger.info('List all todo items...')

      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()

      return result.Items as TodoItem[]
    }

    async CreateTodo (todoItem: TodoItem): Promise<TodoItem> {
      logger.info('Create a new todo item...')
      
      await this.docClient.put({
          TableName: this.todosTable,
          Item: todoItem
      }).promise()

      return todoItem
    }

    async UpdateTodo (todoItem: TodoItem): Promise<string> {      
      logger.info(`Update todo item with ID: ${todoItem.todoId}`)

      await this.docClient.update({
        TableName: this.todosTable,
        Key:{
          "userId": todoItem.userId,
          "todoId": todoItem.todoId
        },
        ConditionExpression: "todoId = :todoId",
        UpdateExpression: "set #n = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
          ":name" : todoItem.name,
          ":dueDate" : todoItem.dueDate,
          ":done" : todoItem.done,
          ":todoId": todoItem.todoId
        },
        ExpressionAttributeNames: {
          "#n" : "name"
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()

      return "success"
    }

    async DeleteTodo (todoId: string, userId: string): Promise<string>{
      logger.info(`Delete todo item with ID: ${todoId}`)
      await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        },
        ConditionExpression: "todoId = :todoId",
        ExpressionAttributeValues: {
          ":todoId": todoId
        }
      }).promise()

      return userId
    }

    async GenerateUploadUrl (todoId: string, userId: string): Promise<string> {
      logger.info(`Generating an upload url for item ID: ${todoId}`)

      await this.docClient.update({
        TableName: this.todosTable,
        Key:{
          "userId": userId,
          "todoId": todoId
        },
        ConditionExpression: "todoId = :todoId",
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":todoId" : todoId,
          ":attachmentUrl" : `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()

      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: parseInt(this.urlExpiration)
      }) as string
    }
}
