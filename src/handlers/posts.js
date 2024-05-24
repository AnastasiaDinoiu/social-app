import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import PostComment from '../models/PostComment.js'
import User from '../models/User.js'
import Like from '../models/Like.js'


/**
 * Adds a new post to the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const addPost = async (fastify, request, reply) => {
    const token = request.headers.authorization
    const { title, content } = request.body
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await fastify.db.models.User.findOne({ where: { id: userId } })
        await fastify.db.models.Post.create({ id: uuid(), userId: user.dataValues.id, title, content })
        return reply.status(201).send({ message: 'Post saved successfully' })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves all posts from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The posts object.
 * @throws {Object} - The error object.
 */
const getPosts = async (fastify, request, reply) => {
    try {
        const posts = await fastify.db.models.Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User, as: 'user', attributes: ['id', 'name', 'email']
                },
                {
                    model: PostComment,
                    as: 'comments',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                },
                {
                    model: Like,
                    as: 'likes',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                }
            ],
            attributes: { exclude: ['userId'] }
        })
        return reply.status(200).send(posts)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves all posts from the database that match the specified filters.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The filtered posts object.
 * @throws {Object} - The error object.
 */
const getFilteredPosts = async (fastify, request, reply) => {
    const { userId, title, sortField = 'createdAt', sortOrder = 'DESC' } = request.query
    const where = {}

    if (userId) {
        where.userId = userId
    }
    if (title) {
        where.title = {
            [Op.like]: `%${title}%`
        }
    }

    try {
        const posts = await fastify.db.models.Post.findAll({
            where,
            order: [[sortField, sortOrder.toUpperCase()]],
            include: [
                {
                    model: User, as: 'user', attributes: ['id', 'name', 'email']
                },
                {
                    model: PostComment,
                    as: 'comments',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                },
                {
                    model: Like,
                    as: 'likes',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                }
            ],
            attributes: { exclude: ['userId'] }
        })
        return reply.status(200).send(posts)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves all posts from the database that belong to a specific user.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The posts object.
 * @throws {Object} - The error object.
 */
const getPostsByUser = async (fastify, request, reply) => {
    const { userId } = request.params
    try {
        const posts = await fastify.db.models.Post.findAll({
            order: [['createdAt', 'DESC']], where: { userId },
            include: [
                {
                    model: User, as: 'user', attributes: ['id', 'name', 'email']
                },
                {
                    model: PostComment,
                    as: 'comments',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                },
                {
                    model: Like,
                    as: 'likes',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                }
            ],
            attributes: { exclude: ['userId'] }
        })
        return reply.status(200).send(posts)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves posts from the database in a paginated format.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The paginated posts object.
 * @throws {Object} - The error object.
 */
const getPagedPosts = async (fastify, request, reply) => {
    const { page = 1, limit = 10 } = request.query
    const offset = (page - 1) * limit

    try {
        const totalPosts = await fastify.db.models.Post.count()
        const posts = await fastify.db.models.Post.findAll({
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User, as: 'user', attributes: ['id', 'name', 'email']
                },
                {
                    model: PostComment,
                    as: 'comments',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                },
                {
                    model: Like,
                    as: 'likes',
                    include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    attributes: { exclude: ['postId', 'userId'] }
                }
            ],
            attributes: { exclude: ['userId'] }
        })
        const totalPages = Math.ceil(totalPosts / limit)
        return reply.status(200).send({
            totalItems: totalPosts,
            totalPages,
            currentPage: parseInt(page),
            items: posts
        })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Updates a post with the specified ID.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The updated post object.
 * @throws {Error} - If there is an error updating the post.
 */
const updatePost = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const updateData = { ...request.body }
        if (Object.keys(updateData).length === 0) {
            return reply.status(400).send({ message: 'No fields to update' })
        }
        const [affectedRows] = await fastify.db.models.Post.update(updateData, { where: { id } })
        if (affectedRows === 0) {
            return reply.status(404).send({ message: 'Post not found' })
        }
        const post = await fastify.db.models.Post.findByPk(id)
        return reply.send(post)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Deletes a post from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const deletePost = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const post = await fastify.db.models.Post.findOne({ where: { id } })
        if (!post) {
            return reply.code(404).send({ message: 'Post not found' })
        }
        await fastify.db.models.Post.destroy({ where: { id } })
        return reply.code(204).send()
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export { addPost, getPosts, getFilteredPosts, getPagedPosts, getPostsByUser, updatePost, deletePost }