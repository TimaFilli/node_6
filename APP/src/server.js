import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
import queryParser from '#helpers/queryParser'
import schema from './modules/index.js'
import model from '#helpers/model'
import ip from '#helpers/getIp'
import JWT from '#helpers/jwt'
import express from 'express'
import query from './query.js'
import http from 'http'
import cors from 'cors'
import path from 'path'
import './config.js'


!async function () {
    const app = express()
    const httpServer = http.createServer(app)

    app.use(cors())
    app.use(graphqlUploadExpress())
    app.use(express.static(path.join(process.cwd(), 'uploads')))

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        context: ({ req }) => {
            const { operation, fieldName } = queryParser(req.body)
            const modelFunctions = model({ databasePath: path.join(path.resolve('src/database')) }) 

            if (fieldName === '__schema') return 

            if ([
                'login',
                'register',
                'permissionActions',
                'permissionModules'
            ].includes(fieldName)) {
                return {
                    model: modelFunctions,
                    agent: req.headers['user-agent'],
                    userIp: req.ip
                }
            }
            
            const TOKEN = req.headers?.token?.trim()

            if (!TOKEN) {
                throw new Error("Token is required!")
            }

            const { userId, agent, userIp } = JWT.verify(TOKEN)
            
            if (
                req.headers['user-agent'].trim() !== agent.trim()
            ) {
                throw new Error("Wrong device")
            }

            const permissions = modelFunctions.read('permissions')

            const permission = permissions.find(permission => {
                const user = permission.userId == userId
                const module = query[fieldName].module == permission.permissionModule
                const action = query[fieldName].actions.find(name => permission[name])

                return user && module && action
            })

            if (
                !permission &&
                [
                    'permissions'
                ].includes(fieldName)
            ) {
                return {
                    userId,
                    model: modelFunctions,
                    agent: req.headers['user-agent'],
                    userIp: req.ip
                }
            }

            if (!permission) {
                throw new Error("You are not allowed!")
            }
            
            return {
                model: modelFunctions,
                agent: req.headers['user-agent'],
                userIp: req.ip
            }
        },
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    })

    await server.start()
    server.applyMiddleware({ app, path: '/graphql'})

    await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve))
    console.log(`🚀 Server ready at http://${ip({ internal: false })}:${process.env.PORT}${server.graphqlPath}`)
}()

/*
    categories
        name
    
    products
        category name price definition img


    user
    
*/