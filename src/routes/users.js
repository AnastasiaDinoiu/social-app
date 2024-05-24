import { schema } from '../validation/schema.js'
import { deleteUser, getUser, getUsers, updateUser } from '../handlers/users.js'


function userRoutes(fastify, options, done) {

    fastify.route({
        method: 'GET',
        url: '/',
        schema: { ...schema['getUsers'], tags: ['users'] },
        // preHandler: authenticate,
        handler: (request, reply) => getUsers(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        schema: { ...schema['getUser'], tags: ['users'] },
        handler: (request, reply) => getUser(fastify, request, reply)
    })

    fastify.route({
        method: 'PUT',
        url: '/:id',
        schema: { ...schema['updateUser'], tags: ['users'] },
        handler: (request, reply) => updateUser(fastify, request, reply)
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: { ...schema['deleteUser'], tags: ['users'] },
        handler: (request, reply) => deleteUser(fastify, request, reply)
    })

    done()
}

export { userRoutes }