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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import authReducer from './state';
import { ContextProvider } from './contexts/ContextProvider';
import App from './App';
import { api } from './state/api';

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

const persistConfig = { key: 'root', storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({ reducer: persistedReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }) });

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ContextProvider>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </BrowserRouter>
        </LocalizationProvider>
      </PersistGate>
    </ContextProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

