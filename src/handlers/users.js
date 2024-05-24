/**
 * Retrieves all users from the database.
 *
 * @param {Object} fastify - The fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Promise} - A promise that resolves with the users or rejects with an error.
 * @throws {Error} - If there is an error retrieving the users.
 */
const getUsers = async (fastify, request, reply) => {
    try {
        const users = await fastify.db.models.User.findAll()
        return reply.send(users)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Retrieves a user by their ID.
 *
 * @param {object} fastify - The Fastify instance.
 * @param {object} request - The request object.
 * @param {object} reply - The reply object.
 * @returns {Promise<object>} - The user object.
 * @throws {Error} - If there is an error retrieving the user.
 */
const getUser = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const user = await fastify.db.models.User.findByPk(id)
        return reply.send(user)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Updates a user with the specified ID.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The updated user object.
 * @throws {Error} - If there is an error updating the user.
 */
const updateUser = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        const updateData = { ...request.body }
        if (Object.keys(updateData).length === 0) {
            return reply.status(400).send({ message: 'No fields to update' })
        }
        const [affectedRows] = await fastify.db.models.User.update(updateData, { where: { id } })
        if (affectedRows === 0) {
            return reply.status(404).send({ message: 'User not found' })
        }
        const user = await fastify.db.models.User.findByPk(id)
        return reply.send(user)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

/**
 * Deletes a user from the database.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @returns {Object} - The response object.
 * @throws {Object} - The error object.
 */
const deleteUser = async (fastify, request, reply) => {
    try {
        const { id } = request.params
        await fastify.db.models.User.destroy({ where: { id } })
        return reply.code(204).send()
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export { getUsers, getUser, updateUser, deleteUser }