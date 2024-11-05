'use client'

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import MainContent from "@/components/mainContent/MainContent";
import styles from "./page.module.scss";

const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql/query',
    cache: new InMemoryCache()
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