import { schema } from '../validation/schema.js'
import { authenticate } from '../hooks/auth.js'
import { addLikeOnPost, deleteLikeFromPost, getLikesFromPost } from '../handlers/likes.js'


function likesRoutes(fastify, options, done) {

    fastify.route({
        method: 'POST',
        url: '/:postId',
        schema: { ...schema['addLikeOnPost'], tags: ['likes'] },
        preHandler: authenticate,
        handler: (request, reply) => addLikeOnPost(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/:postId',
        schema: { ...schema['getLikesFromPost'], tags: ['likes'] },
        preHandler: authenticate,
        handler: (request, reply) => getLikesFromPost(fastify, request, reply)
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: { ...schema['deleteLikeFromPost'], tags: ['likes'] },
        preHandler: authenticate,
        handler: (request, reply) => deleteLikeFromPost(fastify, request, reply)
    })

    done()
}

export { likesRoutes }