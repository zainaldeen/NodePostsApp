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
    
    type AuthData {
        userId: String!
        token: String!
    }
    
    input UserInputData {
        email: String!
        password: String!
        name: String!
    }
    
    input UserLoginData {
        email: String!
        password: String!
    }
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
    }
    
    type LoginQuery {
        loginIn(loginData: UserLoginData): AuthData!
    }
    
    type RootQuery {
        hello: String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`)
