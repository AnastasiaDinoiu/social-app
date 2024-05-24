import { schema } from '../validation/schema.js'
import { authenticate } from '../hooks/auth.js'
import { addPost, deletePost, getFilteredPosts, getPagedPosts, getPosts, getPostsByUser, updatePost } from '../handlers/posts.js'


function postRoutes(fastify, options, done) {

    fastify.route({
        method: 'POST',
        url: '/',
        schema: { ...schema['addPost'], tags: ['posts'] },
        preHandler: authenticate,
        handler: (request, reply) => addPost(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/',
        schema: { ...schema['getPosts'], tags: ['posts'] },
        preHandler: authenticate,
        handler: (request, reply) => getPosts(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/filtered',
        schema: { ...schema['getFilteredPosts'], tags: ['posts'] },
        preHandler: authenticate,
        handler: (request, reply) => getFilteredPosts(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/paged',
        schema: { ...schema['getPagedPosts'], tags: ['posts'] },
        preHandler: authenticate,
        handler: (request, reply) => getPagedPosts(fastify, request, reply)
    })

    fastify.route({
        method: 'GET',
        url: '/:userId',
        schema: { ...schema['getPostsByUser'], tags: ['posts'] },
        preHandler: authenticate,
        handler: (request, reply) => getPostsByUser(fastify, request, reply)
    })

    fastify.route({
        method: 'PUT',
        url: '/:id',
        schema: { ...schema['updatePost'], tags: ['posts'] },
        handler: (request, reply) => updatePost(fastify, request, reply)
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: { ...schema['deletePost'], tags: ['posts'] },
        handler: (request, reply) => deletePost(fastify, request, reply)
    })

    done()
}

export { postRoutes }