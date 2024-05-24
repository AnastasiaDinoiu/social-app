import { getLikesFromPost } from '../handlers/likes.js'

const userSchema = {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' }
}

const postSchema = {
    id: {type: 'string'},
    userId: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' }
}

const commentSchema = {
    id: {type: 'string'},
    userId: { type: 'string' },
    postId: { type: 'string' },
    content: { type: 'string' }
}

const likeSchema = {
    id: {type: 'string'},
    userId: { type: 'string' },
    postId: { type: 'string' }
}

const schema = {
    'getUsers': {
        description: 'Get all users',
        response: {
            200: {
                type: 'array',
                properties: userSchema
            }
        }
    },
    'getUser': {
        description: 'Get a user by ID',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: userSchema
            }
        }
    },
    'addUser': {
        description: 'Add a new user',
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' }
            },
            required: ['name', 'email']
        },
        response: {
            201: {
                type: 'object',
                properties: userSchema
            }
        }
    },
    'updateUser': {
        description: 'Update a user',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: userSchema
            }
        }
    },
    'deleteUser': {
        description: 'Delete a user',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        response: {
            204: {}
        }
    },
    'register': {
        description: 'Register a new user',
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    minLength: 4
                },
                email: {
                    type: 'string',
                    format: 'email'
                },
                password: {
                    type: 'string',
                    minLength: 8,
                    pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$'
                }
            },
            required: ['name', 'email', 'password']
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'login': {
        description: 'Login a user',
        body: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' }
            },
            required: ['email', 'password']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
                }
            }
        }
    },
    'sendResetPasswordEmail': {
        description: 'Send a reset password email',
        params: {
            type: 'object',
            properties: {
                email: { type: 'string' }
            },
            required: ['email']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'resetPassword': {
        description: 'Reset user password',
        body: {
            type: 'object',
            properties: {
                password: { type: 'string' }
            },
            required: ['password']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'addPost': {
        description: 'Add a new post',
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' }
            },
            required: ['title', 'content']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'getPosts': {
        description: 'Get all posts',
        response: {
            200: {
                type: 'array',
                properties: postSchema
            }
        }
    },
    'getPostsByUser': {
        description: 'Get posts by user ID',
        params: {
            type: 'object',
            properties: {
                userId: { type: 'string' }
            },
            required: ['userId']
        },
        response: {
            200: {
                type: 'array',
                properties: postSchema
            }
        }
    },
    'getFilteredPosts': {
        description: 'Get posts with optional filters',
        querystring: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                title: { type: 'string' },
                sortField: { type: 'string' },
                sortOrder: { type: 'string', enum: ['ASC', 'DESC'] }
            }
        },
        response: {
            200: {
                type: 'array',
                properties: postSchema
            }
        }
    },
    'getPagedPosts': {
        description: 'Get posts with pagination',
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'integer', minimum: 1 },
                limit: { type: 'integer', minimum: 1 }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    totalItems: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    currentPage: { type: 'integer' },
                    items: {
                        type: 'array',
                            properties: postSchema
                    }
                }
            }
        }
    },
    'updatePost': {
        description: 'Update a post',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: postSchema
            }
        }
    },
    'deletePost': {
        description: 'Delete a post',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        response: {
            204: {}
        }
    },
    'addCommentOnPost': {
        description: 'Add a new comment on a post',
        params: {
            type: 'object',
            properties: {
                postId: { type: 'string' }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                content: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'getPostComments': {
        description: 'Get all filtered comments with pagination',
        querystring: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                postId: { type: 'string' },
                sortField: { type: 'string' },
                sortOrder: { type: 'string', enum: ['ASC', 'DESC'] },
                page: { type: 'integer', minimum: 1 },
                limit: { type: 'integer', minimum: 1 }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    totalItems: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    currentPage: { type: 'integer' },
                    items: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: commentSchema
                        }
                    }
                }
            }
        }
    },
    'updatePostComment': {
        description: 'Update a comment from a post',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        body: {
            type: 'object',
            properties: {
                content: { type: 'string' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: commentSchema
            }
        }
    },
    'deletePostComment': {
        description: 'Delete a comment from a post',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        response: {
            204: {}
        }
    },
    'addLikeOnPost': {
        description: 'Add a like on a post',
        params: {
            type: 'object',
            properties: {
                postId: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    },
    'getLikesFromPost': {
        description: 'Get all likes from a post',
        params: {
            type: 'object',
            properties: {
                postId: { type: 'string' }
            }
        },
        response: {
            200: {
                type: 'array',
                properties: likeSchema
            }
        }
    },
    'deleteLikeFromPost': {
        description: 'Delete a like from a post',
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            }
        },
        response: {
            204: {}
        }
    },
}

export { schema }