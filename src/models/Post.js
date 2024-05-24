import { Model, DataTypes } from 'sequelize'


/**
 * Represents a Post model.
 *
 * @class
 * @name Post
 * @extends Model
 */
class Post extends Model {
    /**
     * Initializes the Post model.
     *
     * @param {Object} sequelize - The Sequelize instance.
     * @returns {void}
     */
    static initModel(sequelize) {
        Post.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Post',
        })
    }

    /**
     * Defines model associations.
     *
     * @param {Object} sequelize - The collection of all models.
     * @returns {void}
     */
    static associate(sequelize) {
        Post.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' })
        Post.hasMany(sequelize.models.Like, { foreignKey: 'postId', as: 'likes' })
        Post.hasMany(sequelize.models.PostComment, { foreignKey: 'postId', as: 'comments' })
    }
}

export default Post
