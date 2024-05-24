/**
 * Saves data to a Redis database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {number} database - The database number to select.
 * @param {string} key - The key to set in the database.
 * @param {string} value - The value to set for the key.
 * @param {number} time - The expiration time in seconds.
 * @returns {Promise} - A promise that resolves when the data is successfully saved.
 * @throws {Error} - If there is an error saving the data.
 */
const saveData = async (fastify, database, key, value, time) => {
    try {
        await fastify.redis.select(database)
        return await fastify.redis.set(key, value, 'EX', time)
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Retrieves data from a Redis database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {number} database - The index of the Redis database to select.
 * @param {string} key - The key of the data to retrieve.
 * @returns {Promise<any>} - A promise that resolves to the retrieved data.
 * @throws {Error} - If there is an error retrieving the data.
 */
const getData = async (fastify, database, key) => {
    try {
        await fastify.redis.select(database)
        return await fastify.redis.get(key)
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Deletes data from a specified database using a given key.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {number} database - The database number to select.
 * @param {string} key - The key of the data to delete.
 * @returns {Promise<number>} - A promise that resolves to the number of keys deleted.
 * @throws {Error} - If an error occurs during the deletion process.
 */
const deleteData = async (fastify, database, key) => {
    try {
        await fastify.redis.select(database)
        return await fastify.redis.del(key)
    } catch (error) {
        console.error(error)
        throw error
    }
}

export { saveData, getData, deleteData }