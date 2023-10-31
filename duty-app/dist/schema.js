"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "dutydb",
    password: "1994tutski3",
    port: 5432,
});
const DutyType = new graphql_1.GraphQLObjectType({
    name: "Duty",
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
    }),
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        duties: {
            type: new graphql_1.GraphQLList(DutyType),
            resolve() {
                return pool.query("SELECT * FROM duties").then((res) => res.rows);
            },
        },
    },
});
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutationType",
    fields: {
        addDuty: {
            type: DutyType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(_, args) {
                const query = "INSERT INTO duties (name) VALUES ($1) RETURNING *";
                const values = [args.name];
                return pool.query(query, values).then((res) => res.rows[0]);
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
