import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { Provider } from 'react-redux';
import { store } from "./redux/store"
import App from './App';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Provider>
    </BrowserRouter>

  </React.StrictMode>
);

