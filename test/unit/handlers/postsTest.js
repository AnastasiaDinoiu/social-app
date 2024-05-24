import { expect } from 'chai'
import sinon from 'sinon'
import { StatusCodes } from 'http-status-codes'
import Post from '../../../src/models/Post.js'
import * as handler from '../../../src/handlers/posts.js'
import { uuid } from 'uuidv4'
import jwt from 'jsonwebtoken'

const createMockReqRes = (headers = {}, body = {}, params = {}) => {
    return {
        req: {
            headers,
            body,
            params
        },
        res: {
            status: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis(),
            code: sinon.stub().returnsThis()
        }
    }
}

describe('postHandler', () => {
    afterEach(() => {
        sinon.restore()
    })

    describe('@addPost', () => {
        let createStub = null
        let findOneStub = null
        let fastifyStub = null
        let jwtVerifyStub = null
        const postId = uuid()
        const userId = uuid()

        beforeEach(() => {
            createStub = sinon.stub(Post, 'create')
            findOneStub = sinon.stub()
            jwtVerifyStub = sinon.stub(jwt, 'verify').returns({ userId })

            fastifyStub = {
                db: {
                    models: {
                        User: {
                            findOne: findOneStub,
                        },
                        Post: {
                            create: createStub,
                        },
                    }
                }
            }
        })

        it('should create a post', async () => {
            const { req, res } = createMockReqRes(
                { authorization: 'Bearer token' },
                { title: 'title1', content: 'content1' },
                {}
            )

            const mockUser = { dataValues: { id: userId } }
            const mockPost = {
                id: postId,
                userId: userId,
                title: 'title1',
                content: 'content1'
            }

            findOneStub.resolves(mockUser)
            createStub.resolves(mockPost)

            await handler.addPost(fastifyStub, req, res)

            expect(jwtVerifyStub.calledOnce).to.be.true
            expect(findOneStub.calledOnce).to.be.true
            expect(createStub.calledOnce).to.be.true
            expect(res.status.calledWith(StatusCodes.CREATED)).to.be.true
            expect(res.send.calledWith({ message: 'Post saved successfully' })).to.be.true
        })

        it('should return 500 if an error occurs', async () => {
            const { req, res } = createMockReqRes(
                { authorization: 'Bearer token' },
                { title: 'title1', content: 'content1' },
                {}
            )

            findOneStub.rejects(new Error('error'))

            try {
                await handler.addPost(fastifyStub, req, res)
            } catch (error) {
                expect(jwtVerifyStub.calledOnce).to.be.true
                expect(findOneStub.calledOnce).to.be.true
                expect(createStub.called).to.be.false
                expect(res.code.calledWith(StatusCodes.INTERNAL_SERVER_ERROR)).to.be.true
            }
        })

    })

    describe('@getPosts', () => {
        let findAllStub = null
        let fastifyStub = null

        beforeEach(() => {
            findAllStub = sinon.stub()
            fastifyStub = {
                db: {
                    models: {
                        Post: {
                            findAll: findAllStub
                        }
                    }
                }
            }
        })

        it('should return all posts', async () => {
            const { req, res } = createMockReqRes()

            const mockPosts = [
                {
                    id: uuid(),
                    title: 'title1',
                    content: 'content1',
                    user: {
                        id: uuid(),
                        name: 'user1',
                        email: 'test@test.com',
                    },
                    comments: [
                        {
                            id: uuid(),
                            content: 'comment1',
                            user: {
                                id: uuid(),
                                name: 'user2',
                                email: 'test@test.com',
                            }
                        }
                    ],
                    likes: [
                        {
                            id: uuid(),
                            user: {
                                id: uuid(),
                                name: 'user3',
                                email: 'test@test.com',
                            }
                        }
                    ]
                }
            ]

            findAllStub.resolves(mockPosts)

            await handler.getPosts(fastifyStub, req, res)

            expect(findAllStub.calledOnce).to.be.true
            expect(res.status.calledWith(StatusCodes.OK)).to.be.true
            expect(res.send.calledWith(mockPosts)).to.be.true
        })

        it('should return 500 if an error occurs', async () => {
            const { req, res } = createMockReqRes()

            findAllStub.rejects(new Error('error'))

            try {
                await handler.getPosts(fastifyStub, req, res)
            } catch (error) {
                expect(findAllStub.calledOnce).to.be.true
                expect(res.code.calledWith(StatusCodes.INTERNAL_SERVER_ERROR)).to.be.true
            }
        })
    })
})
