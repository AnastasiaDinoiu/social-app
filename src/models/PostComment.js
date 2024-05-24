import { Model, DataTypes } from 'sequelize'


/**
 * Represents a PostComment model.
 *
 * @class
 * @name PostComment
 * @extends Model
 */
class PostComment extends Model {
    /**
     * Initializes the PostComment model.
     *
     * @param {Object} sequelize - The Sequelize instance.
     * @returns {void}
     */
    static initModel(sequelize) {
        PostComment.init({
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
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'PostComment',
        })
    }

    /**
     * Defines model associations.
     *
     * @param {Object} sequelize - The collection of all models.
     * @returns {void}
     */
    static associate(sequelize) {
        PostComment.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' })
        PostComment.belongsTo(sequelize.models.Post, { foreignKey: 'postId', as: 'post' })
    }
}

export default PostComment
