import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

window.__APOLLO_CLIENT__ = new ApolloClient({
    cache: new InMemoryCache(),
    link: new UploadHttpLink({ uri: 'https://api.8ify.capsiatech.eu/database' })
});