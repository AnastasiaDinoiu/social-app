import jwt from 'jsonwebtoken'
import { getData } from '../util/redis.js'


/**
 * Authenticate function.
 *
 * This function is responsible for authenticating a request by checking the authorization header.
 * It verifies the JWT token provided in the authorization header using the JWT_SECRET from the environment variables.
 * If the token is invalid or missing, it returns a 401 error response.
 *
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} - If there is an error during authentication.
 */
async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization
        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing authorization header' })
        }
        const { email } = jwt.verify(authHeader, process.env.JWT_SECRET)
        request.user = { email: email }
    } catch (err) {
        reply.code(401).send({ error: 'Invalid or expired token' })
    }
}

/**
 * Validates a token by decoding it and checking if it matches the stored value in Redis.
 * If the token is invalid or does not match the stored value, it returns a 401 Unauthorized response.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The Fastify request object.
 * @param {Object} reply - The Fastify reply object.
 * @returns {Promise<void>} - A Promise that resolves when the token is validated or rejects with an error.
 */
async function validateToken(fastify, request, reply) {
    try {
        const token = request.headers.authorization
        const { email } = jwt.verify(token, process.env.JWT_SECRET)

        const value = await getData(fastify, 0, email)
        console.log(`value: ${value}`)
        if (!value || value !== token) {
            reply.code(401).send({ error: 'Invalid token' })
        }
    } catch (err) {
        reply.code(401).send({ error: 'Invalid token' })
    }
}

export { authenticate, validateToken }