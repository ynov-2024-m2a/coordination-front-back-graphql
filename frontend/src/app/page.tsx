'use client'

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink  } from '@apollo/client';
import MainContent from "@/components/mainContent/MainContent";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import styles from "./page.module.scss";

const httpLink = new HttpLink({
    uri: 'http://localhost:8080/query', // Adresse de votre serveur HTTP GraphQL
  });
  
  // Configuration WebSocket (pour les subscriptions)
  const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:8080/query', // Remplacez par l'URL WebSocket de votre serveur
    })
    );
  
  // Logique pour diviser le trafic entre HTTP et WebSocket
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink, // Utilise WebSocket pour les subscriptions
    httpLink, // Utilise HTTP pour les queries et mutations
  );

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

const Page = () => {
    return (
        <ApolloProvider client={client}>
            <div className={styles.container}>
                <main className={styles.page}>
                    <MainContent />
                </main>
            </div>
        </ApolloProvider>
    );
};

export default Page;