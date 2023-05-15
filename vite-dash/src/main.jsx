import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './index.scss';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import authReducer from './state';
import { ContextProvider } from './contexts/ContextProvider';
import App from './App';
import { api } from './state/api';

const persistConfig = { key: 'root', storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({ reducer: persistedReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }) });

// const store = configureStore({
//   reducer: {
//     // [api.reducerPath]: api.reducer,
//     persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//     serializableCheck: {
//       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//     },
//   }).concat(api.middleware),
// });

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ContextProvider>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </PersistGate>
    </ContextProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

