import { finished } from 'stream/promises'
import JWT from '#helpers/jwt'
import ip from '#helpers/getIp'
import sha256 from 'sha256'
import path from 'path'
import fs from 'fs'

export default {
    Mutation: {
        login: (_, { username, password }, { model, userIp, agent }) => {
            username = username.trim()
            password = password.trim()

            const user = model
                .read('users')
                .find(user => user.username == username && user.password == sha256(password))
            
            if (user) {
                return {
                    status: 200,
                    message: "The user successfully logged in!",
                    data: user,
                    token: JWT.sign({
                        userId: user.userId,
                        userIp,
                        agent,
                    })
                }
            }

            throw new Error("Invalid username or password!")
        },

        register: async (_, { profile, username, password, gender, birthDate }, { model, agent, userIp }) => {
            const { createReadStream, filename } = await profile

            const fileName = Date.now() + filename.replace(/\s/g, '')
            username = username.trim()
            password = password.trim()
            birthDate = birthDate.trim()

            let users = model.read('users')
            let user = users.find(user => user.username == username)

            if (user) {
                throw new Error("The user already exists!")
            }

            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName))
            createReadStream().pipe(out)
            await finished(out)

            user = {
                userId: users.at(-1)?.userId + 1 || 1,
                password: sha256(password), 
                profile: fileName,
                birthDate,
                username,
                gender, 
            }

            users.push(user)
            model.write('users', users)

            return {
                status: 200,
                message: "The user successfully registered!",
                data: user,
                token: JWT.sign({
                    userId: user.userId,
                    userIp,
                    agent,
                })
            }
        }
    },

    Query: {
        users: (_, args, { model }) => {
            return model.read('users')
        }
    },

    User: {
        profile: global => `http://${ip({ internal: false })}:${process.env.PORT}/${global.profile}`
    }
}