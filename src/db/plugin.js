import fp from 'fastify-plugin'
import { sequelize } from './index.js'
import setupModels from '../models/index.js'


/**
 * A plugin for Fastify that sets up and manages a Sequelize database connection.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 * @param {Object} options - The plugin options.
 * @returns {Promise<void>} - A promise that resolves when the plugin has finished setting up the database connection.
 */
async function sequelizePlugin(fastify, options) {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')

    setupModels(sequelize)
    await sequelize.sync()

    fastify.decorate('db', sequelize)
    fastify.addHook('onClose', async (instance, done) => {
        await sequelize.close()
        done()
    })
}

export default fp(sequelizePlugin, { name: 'db-plugin' })
