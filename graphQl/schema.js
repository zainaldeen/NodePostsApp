const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageURL: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
        createdAt: String!
        updatedAt: String!
    }
    
    type PostData {
        posts: [Post!]!
        totalItems: Int!
    }
    
    
    input UserInputData {
        email: String!
        password: String!
        name: String!
    }
    
    input PostInputData {
        title: String!
        content: String!
        imageURL: String!
    }
    
    input UserLoginData {
        email: String!
        password: String!
    }
    
    
    type AuthData {
        userId: String!
        token: String!
    }
    
    input Pagination {
        page: Int!
        perPage: Int!
    }
    
    type responseMessage {
        success: Boolean!
        error: Boolean!
        message: String!
    }
    
    type RootQuery {
        logIn(loginData: UserLoginData): AuthData!
        getPosts(pagination: Pagination!): PostData!
        getPostById(postId: ID!): Post!
        user: User!
    }
    
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(postId: ID!, postData: PostInputData ): Post!
        deletePost(postID: ID!): responseMessage!
        updateUser(status: String!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`)
