import { schema } from '../validation/schema.js'
import { authenticate } from '../hooks/auth.js'
import { addCommentOnPost, deletePostComment, getPostComments, updatePostComment } from '../handlers/postComments.js'


function commentsRoutes(fastify, options, done) {

    fastify.route({
        method: 'POST',
        url: '/:postId',
        schema: { ...schema['addCommentOnPost'], tags: ['postComments'] },
        preHandler: authenticate,
        handler: (request, reply) => addCommentOnPost(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/',
        schema: { ...schema['getPostComments'], tags: ['postComments'] },
        preHandler: authenticate,
        handler: (request, reply) => getPostComments(fastify, request, reply)
    })

    fastify.route({
        method: 'PUT',
        url: '/:id',
        schema: { ...schema['updatePostComment'], tags: ['postComments'] },
        preHandler: authenticate,
        handler: (request, reply) => updatePostComment(fastify, request, reply)
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: { ...schema['deletePostComment'], tags: ['postComments'] },
        preHandler: authenticate,
        handler: (request, reply) => deletePostComment(fastify, request, reply)
    })

    done()
}

export { commentsRoutes }