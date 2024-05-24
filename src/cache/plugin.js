import fp from 'fastify-plugin'
import IORedis from 'ioredis'


/**
 * Connects to a Redis server and decorates the Fastify instance with a Redis client.
 *
 * @param {object} fastify - The Fastify instance.
 * @param {object} options - The options for the Redis plugin.
 * @returns {Promise<void>} - A promise that resolves when the Redis client is connected and decorated.
 */
// eslint-disable-next-line no-unused-vars
async function redisPlugin(fastify, options) {
    const redisClient = new IORedis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    })

    redisClient.on('connect', () => {
        console.log('Connected to Redis')
    })
    redisClient.on('error', (err) => {
        console.error('Redis connection error:', err)
    })

    fastify.decorate('redis', redisClient)

    fastify.addHook('onClose', async (instance, done) => {
        await redisClient.quit()
        done()
    })
}

export default fp(redisPlugin, { name: 'redis-plugin' })
