
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJI/uInx9HIqSlMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1tNHFuc3hoYy51cy5hdXRoMC5jb20wHhcNMjEwMTI1MTY0NTA3WhcN
MzQxMDA0MTY0NTA3WjAkMSIwIAYDVQQDExlkZXYtbTRxbnN4aGMudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzchT5tfsoQhLTUq9
XYRyZmFVvo2StlnSW8GcagLScBlT2hz/i9pfKjx7a/GOAWftiTgK2S2aXVv0CyS+
3ese5CfA1NP4UagUF9eSAFLLxNMTpedmT2a618oFh6WjchiJ6RuW23Z34DVJhvti
AIxlFpr2bjzc8Cvvd2CopjbW33CM7Hll+uIDoDnmN1IFIeLsPEFKXi7fHnv1mWoK
y8dppzQVA5H755KP7t/ptbS7BrZuGJjh03jVuDxsf2yLsiszf2gsOG0Lln7CBsex
3/igpwZ5/hcbAI/2yi1g29qoNi4y2JqbVWs7qvJ8t/WOw6SO6wcFbRdzRX5Ley7D
zWvb6QIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSa5rDoXR7V
vDNLC7+cTpt6a36QojAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AKnGfpXDD4wyN3wEjYxXMeR/aq4zZCUxuzwzHvUBpJOYWxCKxBvIaKDduT/U9wa3
KX1arVsTOS3iwhTTVOVI/FDDtKd9SQvq79gBuVMwqWZYr1xAyBhmOQMJscZ/7Ocf
KeyJlIggyZRbV7rrvooOBdHjspUIJmaL82wZikFWAQG3wLOkaZBzagV8nCWyrCwV
lSYNbmbI/OKYv0+OBqiDBicF78E+gl4P3PsmA7ficHck0/zQjDIde8FcD72U8dBL
hCT4Y9uwYx3crzqMiw9LcAdbfxDmPDZWyHOLMCxhqIMa40PXC87UyRZz/1tNUgUK
pswjXbB2Ki/FOBMvKA1heTQ=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
