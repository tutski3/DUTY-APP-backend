"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const index_1 = require("c:/Users/Ryzen/Desktop/techexam/duty-app/node_modules/express-graphql/index");
const schema_1 = require("./schema");
const app = express();
app.use("/graphql", (0, index_1.graphqlHTTP)({
    schema: schema_1.default,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
