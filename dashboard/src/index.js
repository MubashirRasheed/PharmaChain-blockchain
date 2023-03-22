import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import authReducer from './state';
import { ContextProvider } from './contexts/ContextProvider';
import App from './App';

const persistConfig = { key: 'root', storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({ reducer: persistedReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }) });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

