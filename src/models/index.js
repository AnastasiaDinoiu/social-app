import User from './User.js'
import Post from './Post.js'
import Like from './Like.js'
import PostComment from './PostComment.js'


export default function setupModels(sequelize) {
    User.initModel(sequelize)
    Post.initModel(sequelize)
    Like.initModel(sequelize)
    PostComment.initModel(sequelize)

    Post.associate(sequelize)
    Like.associate(sequelize)
    PostComment.associate(sequelize)
}