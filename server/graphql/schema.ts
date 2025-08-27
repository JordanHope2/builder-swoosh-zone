import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Company {
    id: ID!
    name: String
    description: String
  }

  type Job {
    id: ID!
    title: String
    description: String
    location: String
    company: Company
  }

  type Query {
    jobs: [Job]
    job(id: ID!): Job
  }
`);
