// If you need to support IE11 uncomment the imports below
//import "react-app-polyfill/ie11";
//import "core-js/stable"; 
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';

// MSAL imports
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

// Theme Provider
import {
  ChakraProvider,
} from '@chakra-ui/react';
import theme from "./styles/theme";

console.log(theme);

export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ChakraProvider theme={theme}>
        <App pca={msalInstance} />
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
