import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { getSupabase } from '../../supabase';

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    email: String
  }

  extend type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data;
    },
  },
};

export const usersServer = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
