import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
  } from "graphql";
  import { Pool } from "pg";
  
  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "dutydb",
    password: "1994tutski3",
    port: 5432,
  });
  
  const DutyType = new GraphQLObjectType({
    name: "Duty",
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
    }),
  });
  
  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      duties: {
        type: new GraphQLList(DutyType),
        resolve() {
          return pool.query("SELECT * FROM duties").then((res) => res.rows);
        },
      },
    },
  });
  
  const RootMutation = new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
      addDuty: {
        type: DutyType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_, args) {
          const query = "INSERT INTO duties (name) VALUES ($1) RETURNING *";
          const values = [args.name];
          return pool.query(query, values).then((res) => res.rows[0]);
        },
      },
    },
  });
  
  export default new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  });
  