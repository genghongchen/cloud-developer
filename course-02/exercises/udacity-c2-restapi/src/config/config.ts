// "host": "udagramchendev.cufqdj1wl2rb.us-east-2.rds.amazonaws.com"
// "aws_region": "us-east-2"
// "aws_profile": "default"
// "aws_media_bucket": "udagram-chen-dev"
export const config = {
  "dev": {
    "username": process.env.POSTGRESS_USERNAME,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRESS_DATABASE,
    "host": process.env.POSTGRESS_HOST,
    "dialect": "postgres",
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "postgres",
    "aws_region": "",
    "aws_profile": "",
    "aws_media_bucket": ""
  }
}
