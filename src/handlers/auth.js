import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'
import { saveData } from '../util/redis.js'
import { sendPasswordResetEmail } from '../util/sendEmail.js'


/**
 * Register a new user.
 *
 * @param {Object} fastify - The fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Error} - If there is an error during registration.
 */
const register = async (fastify, request, reply) => {
    const { name, email, password } = request.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await fastify.db.models.User.create({ id: uuid(), name, email, password: hashedPassword })

        return reply.status(201).send({ message: 'User registered successfully' })
    } catch (error) {
        return reply.send(error)
    }
}

/**
 * Login a registered user.
 *
 * @param {object} fastify - The fastify instance.
 * @param {object} request - The request object.
 * @param {object} reply - The reply object.
 * @returns {object} - The token object.
 * @throws {object} - The error object.
 */
const login = async (fastify, request, reply) => {
    const { email, password } = request.body
    try {
        const user = await fastify.db.models.User.findOne({ where: { email } })
        if (!user) {
            return reply.status(401).send({ error: 'Invalid email' })
        }

        const match = await bcrypt.compare(password, user.dataValues.password)
        if (!match) {
            return reply.status(401).send({ error: 'Wrong password' })
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' })

        return reply.send({ token })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Sends a password reset email to the specified email address.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const sendResetPasswordEmail = async (fastify, request, reply) => {
    const { email } = request.params
    try {
        const user = await fastify.db.models.User.findOne({ where: { email } })
        if (!user) {
            return reply.status(401).send({ error: 'Invalid email' })
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '10m' })
        await saveData(fastify, 0, email, token, 600)
        const url = `${process.env.HOST}:${process.env.PORT}/reset-password?token=${token}`
        await sendPasswordResetEmail(fastify, email, user.name, url)

        return reply.send({ message: 'Email sent successfully' })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Resets the password for a user.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Error} - If there is an error during the password reset process.
 */
const resetPassword = async (fastify, request, reply) => {
    const token = request.headers.authorization
    const { password } = request.body
    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await fastify.db.models.User.findOne({ where: { email } })
        if (!user) {
            return reply.status(401).send({ error: 'Invalid email' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await fastify.db.models.User.update({ password: hashedPassword }, { where: { email } })

        return reply.send({ message: 'Password successfully changed' })
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export { login, register, sendResetPasswordEmail, resetPassword }