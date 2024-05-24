import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'


/**
 * Adds a new comment on a post to the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const addCommentOnPost = async (fastify, request, reply) => {
    const token = request.headers.authorization
    const { postId } = request.params
    const { content } = request.query
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        const post = await fastify.db.models.Post.findOne({ where: { id: postId } })
        if (!post) {
            return reply.code(404).send({ message: 'Post not found' })
        }
        await fastify.db.models.PostComment.create({ id: uuid(), userId, postId, content })
        return reply.status(201).send({ message: 'Post comment saved successfully' })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves post comments from the database in a paginated format.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The paginated post comments object.
 * @throws {Object} - The error object.
 */
const getPostComments = async (fastify, request, reply) => {
    const { userId, postId, sortField = 'createdAt', sortOrder = 'DESC', page = 1, limit = 10 } = request.query
    const offset = (page - 1) * limit
    const where = {}
    if (userId) {
        where.userId = userId
    }
    if (postId) {
        where.postId = postId
    }

    try {
        const totalPostComments = await fastify.db.models.PostComment.count()
        const comments = await fastify.db.models.PostComment.findAll({
            where,
            order: [[sortField, sortOrder.toUpperCase()]],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        })
        const totalPages = Math.ceil(totalPostComments / limit)
        return reply.status(200).send({
            totalItems: totalPostComments,
            totalPages,
            currentPage: parseInt(page),
            items: comments
        })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Updates a comment from post with the specified ID.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The updated post object.
 * @throws {Error} - If there is an error updating the post.
 */
const updatePostComment = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const updateData = { ...request.body }
        if (Object.keys(updateData).length === 0) {
            return reply.status(400).send({ message: 'No field to update' })
        }
        const [affectedRows] = await fastify.db.models.PostComment.update(updateData, { where: { id } })
        if (affectedRows === 0) {
            return reply.status(404).send({ message: 'Comment not found' })
        }
        const comment = await fastify.db.models.PostComment.findByPk(id)
        return reply.send(comment)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Deletes a comment from post from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const deletePostComment = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const comment = await fastify.db.models.PostComment.findOne({ where: { id } })
        if (!comment) {
            return reply.code(404).send({ message: 'Comment not found' })
        }
        await fastify.db.models.PostComment.destroy({ where: { id } })
        return reply.code(204).send()
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export { addCommentOnPost, getPostComments, updatePostComment, deletePostComment }