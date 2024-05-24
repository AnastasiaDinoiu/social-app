import Fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { authRoutes } from './src/routes/auth.js'
import dbPlugin from './src/db/plugin.js'
import redisPlugin from './src/cache/plugin.js'
import dotenv from 'dotenv'
import { userRoutes } from './src/routes/users.js'
import { postRoutes } from './src/routes/posts.js'
import { commentsRoutes } from './src/routes/comments.js'
import { likesRoutes } from './src/routes/likes.js'


dotenv.config()
const fastify = Fastify({
    logger: true
})

fastify.register(dbPlugin)
fastify.register(redisPlugin)
fastify.register(fastifySwagger, {
    swagger: {
        info: { title: 'fastify-api', version: '1.0.0' },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },
        security: [{
            Bearer: []
        }],
    }
})
fastify.register(fastifySwaggerUi, {
    exposeRoute: true,
    routePrefix: '/docs'
})

fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(userRoutes, { prefix: '/users' })
fastify.register(postRoutes, { prefix: '/posts' })
fastify.register(commentsRoutes, { prefix: '/comments' })
fastify.register(likesRoutes, { prefix: '/likes' })

fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
        // Eroare de validare
        const errors = error.validation.map(err => ({
            field: err.instancePath,
            message: err.message
        }))
        reply.status(400).send({ errors })
    } else if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message
        }))
        reply.status(400).send({ errors })
    } else {
        // Alte erori
        reply.status(error.statusCode || 500).send({
            statusCode: error.statusCode || 500,
            error: error.name || 'Internal Server Error',
            message: error.message
        })
    }
})

const PORT = 3002

const start = async () => {
    try {
        await fastify.listen({ port: PORT })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()