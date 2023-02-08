const express = require('express');
let world = require("./world");


const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = require("./schema");
// Provide resolver functions for your schema fields
const resolvers = require("./resolvers");

const server = new ApolloServer({
    typeDefs, resolvers ,context: async ({ req }) => ({
        world: world
    })
});
const app = express();
app.use(express.static('public'));
server.start().then(res => {
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at
http://localhost:4000${server.graphqlPath}`)
    );

})
