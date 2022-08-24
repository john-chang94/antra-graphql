const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    message: String
    person: Person
    people: [Person!]!
    Todo: Todo
    todos(id: String): Todo
    notes: [Note]
    
  }

  type Person {
    p_id: String
    name: String
    email: String
    age: Int
  }

  type Todo {
    t_id: String
    p_id: String
    task: String
    completed: Boolean
  }

  type Note {
    n_id: String 
    t_id: String 
    note: String
  }
  
  type Mutation {
    addTodo(id:String, name:String, task:String!): Todo
  }
`;

const people = [
  { p_id: "1m", name: "Mike", email: "mike@email.com", age: 24, completed: false },
  { p_id: "2m", name: "Amy", email: "amy@email.com", age: 23, completed: false },
  { p_id: "3m", name: "Dan", email: "dan@email.com", age: 25, completed: false }
];

const todos = [
  { t_id: "11", task: "wake up", person: "Mike" },
  { t_id: "12", task: "make breakfast", person: "Amy" },
  { t_id: "13", task: "check email", person: "Amy" },
  { t_id: "14", task: "check notes", person: "Dan" }
]

const notes = [
  { n_id: "1n", t_id: "12", note: "skim milk preferred" },
  { n_id: "2n", t_id: "13", note: "some emails moved to subfolder"}
]

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    message: () => {
      return "message"
    },
    person: () => {
      return people[0]
      // return {
      //   name: "John",
      //   age: 28
      // }
    },
    people: () => {
      return people
    },
    todos: (_,args) => {
      if (args.id) {
        return todos.find(todo => todo.id === args.id);
      }
      if (args.name) {
        return todos.filter(todo => todo.name === args.name);
      }
      return todos
    },
    notes: () => {
      return notes
    },
    Todo: {
      person: (parent) => {
        return people.find(p => p.name === parent.person);
      }
    }
  },

  // Mutation: {
  //   addTodo: (_,args) => {
  //     const todo = { content: args.content, id: args.id, person: args.person };
  //     todos.push(todo);
  //     return todo;
  //   }
  // }
};

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);