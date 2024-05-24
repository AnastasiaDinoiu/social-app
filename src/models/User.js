import { Model, DataTypes } from 'sequelize'


/**
 * Represents a User model.
 *
 * @class
 * @name User
 * @extends Model
 */
class User extends Model {
    /**
     * Initializes the User model.
     *
     * @param {Object} sequelize - The Sequelize instance.
     * @returns {void}
     */
    static initModel(sequelize) {
        User.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profilePicture: {
                type: DataTypes.STRING,
            }
        }, {
            sequelize,
            modelName: 'User',
        })
    }
}

export default User
