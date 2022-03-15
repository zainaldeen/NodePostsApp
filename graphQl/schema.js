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
    
    type AuthData {
        userId: String!
        token: String!
    }
    
    type RootQuery {
        logIn(email:String!, password: String!): AuthData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`)
