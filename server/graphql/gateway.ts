import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'jobs', url: 'http://localhost:8080/graphql/jobs' },
      { name: 'users', url: 'http://localhost:8080/graphql/users' },
    ],
  }),
});

export const gatewayServer = new ApolloServer({
  gateway,
});
