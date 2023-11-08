const request = require("supertest");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const createTestClient = require("apollo-server-testing").createTestClient;
const { Pool } = require("pg");

const typeDefs = gql`
  type Duty {
    id: String
    name: String
  }

  type Query {
    duties: [Duty]
  }

  type Mutation {
    addDuty(name: String!): Duty
  }
`;

const resolvers = {
  Query: {
    duties: async () => {
      const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "dutydb",
        password: "1994tutski3",
        port: 5432,
      });
      const result = await pool.query("SELECT * FROM duties");
      return result.rows;
    },
  },
  Mutation: {
    addDuty: async (_, { name }) => {
      const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "dutydb",
        password: "1994tutski3",
        port: 5432,
      });
      const query = "INSERT INTO duties (name) VALUES ($1) RETURNING *";
      const values = [name];
      const result = await pool.query(query, values);
      return result.rows[0];
    },
  },
};

describe("GraphQL API tests", () => {
  let server;
  let testClient;

  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    testClient = createTestClient(server);
  });

  afterAll(async () => {
    try {
      
      const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "dutydb",
        password: "1994tutski3",
        port: 5432,
      });
  
      
      await pool.query("DELETE FROM duties WHERE name = 'Test Duty'");
  
      
      await pool.end();
    } catch (error) {
      console.error("Error cleaning up the database:", error);
    }
  });

  it("should get duties", async () => {
    const GET_DUTIES = gql`
      query {
        duties {
          id
          name
        }
      }
    `;

    const { data } = await testClient.query({ query: GET_DUTIES }); 
    expect(data.duties).toHaveLength(2); 
  });

  it("should add a duty", async () => {
    const ADD_DUTY = gql`
      mutation($name: String!) {
        addDuty(name: $name) {
          id
          name
        }
      }
    `;

    const variables = { name: "New Duty" };
    const { data } = await testClient.mutate({ mutation: ADD_DUTY, variables });

    
    expect(data.addDuty.name).toBe("New Duty");
  });
});
