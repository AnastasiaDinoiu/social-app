import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'


/**
 * Adds a like on a post to the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const addLikeOnPost = async (fastify, request, reply) => {
    const token = request.headers.authorization
    const { postId } = request.params
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        const post = await fastify.db.models.Post.findOne({ where: { id: postId } })
        if (!post) {
            return reply.code(404).send({ message: 'Post not found' })
        }
        if (await fastify.db.models.Like.findOne({ where: { userId, postId } })) {
            return reply.status(400).send({ message: 'User already liked this post'})
        }
        await fastify.db.models.Like.create({ id: uuid(), userId, postId })
        return reply.status(201).send({ message: 'Like saved successfully' })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves likes of a post from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The likes list.
 * @throws {Object} - The error object.
 */
const getLikesFromPost = async (fastify, request, reply) => {
    const { postId } = request.params
    try {
        const likes = await fastify.db.models.Like.findAll({ where: { postId }, attributes: { exclude: ['postId'] } })
        return reply.status(200).send(likes)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Deletes a like from post from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const deleteLikeFromPost = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const like = await fastify.db.models.Like.findOne({ where: { id } })
        if (!like) {
            return reply.code(404).send({ message: 'Like not found' })
        }
        await fastify.db.models.Like.destroy({ where: { id } })
        return reply.code(204).send()
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export { addLikeOnPost, getLikesFromPost, deleteLikeFromPost }