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
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    type RootQuery {
        hello: String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`)
