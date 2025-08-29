import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { getSupabaseReadReplica } from '../../supabase';

const typeDefs = gql`
  type Company @key(fields: "id") {
    id: ID!
  }

  type Job @key(fields: "id") {
    id: ID!
    title: String
    description: String
    location: String
    company: Company
  }

  extend type Query {
    jobs: [Job]
    job(id: ID!): Job
  }
`;

const resolvers = {
  Query: {
    jobs: async () => {
      const supabase = getSupabaseReadReplica();
      const { data, error } = await supabase.from('jobs').select('*, companies(*)');
      if (error) throw error;
      return data;
    },
    job: async (_: any, { id }: { id: string }) => {
      const supabase = getSupabaseReadReplica();
      const { data, error } = await supabase.from('jobs').select('*, companies(*)').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  },
};

export const jobsServer = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
