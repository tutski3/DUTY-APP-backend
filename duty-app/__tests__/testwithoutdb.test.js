const request = require("supertest");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const createTestClient = require("apollo-server-testing").createTestClient;


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
    duties: () => [
      { id: "1", name: "Duty 1" },
      { id: "2", name: "Duty 2" },
    ],
  },
  Mutation: {
    addDuty: (_, { name }) => {
      return { id: "3", name };
    },
  },
};

describe("GraphQL API tests", () => {
  let server;
  let testClient;

  const { ApolloServer } = require("apollo-server-express");
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
