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
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }
    
    type AuthData {
        userId: String!
        token: String!
    }
    
    type RootQuery {
        logIn(loginData: UserLoginData): AuthData!
        getPosts: PostData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`)
