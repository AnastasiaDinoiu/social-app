import { Model, DataTypes } from 'sequelize'


/**
 * Represents a Like model.
 *
 * @class
 * @name Like
 * @extends Model
 */
class Like extends Model {
    /**
     * Initializes the Like model.
     *
     * @param {Object} sequelize - The Sequelize instance.
     * @returns {void}
     */
    static initModel(sequelize) {
        Like.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postId: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'Like',
        })
    }

    /**
     * Defines model associations.
     *
     * @param {Object} sequelize - The collection of all models.
     * @returns {void}
     */
    static associate(sequelize) {
        Like.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' })
        Like.belongsTo(sequelize.models.Post, { foreignKey: 'postId', as: 'post' })
    }
}

export default Like
