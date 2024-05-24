import { schema } from '../validation/schema.js'
import { login, register, resetPassword, sendResetPasswordEmail } from '../handlers/auth.js'
import { validateToken } from '../hooks/auth.js'


function authRoutes(fastify, options, done) {

    fastify.route({
        method: 'POST',
        url: '/register',
        schema: { ...schema['register'], tags: ['auth']},
        handler: (request, reply) => register(fastify, request, reply)
    })

    fastify.route({
        method: 'POST',
        url: '/login',
        schema: { ...schema['login'], tags: ['auth'] },
        handler: (request, reply) => login(fastify, request, reply)
    })

    fastify.route({
        method: 'POST',
        url: '/send-reset-password-email/:email',
        schema: { ...schema['sendResetPasswordEmail'], tags: ['auth'] },
        handler: (request, reply) => sendResetPasswordEmail(fastify, request, reply)
    })

    fastify.route({
        method: 'POST',
        url: '/reset-password',
        schema: { ...schema['resetPassword'], tags: ['auth'] },
        preHandler: (request, reply) => validateToken(fastify, request, reply),
        handler: (request, reply) => resetPassword(fastify, request, reply)
    })

    done()
}

export { authRoutes }