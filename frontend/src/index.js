import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts } from "./store/slices/product-slice"
// import products from "./data/products.json";
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";
import axios from "axios";

// const url = `http://localhost:9002`

let products;

axios.get(`${import.meta.env.VITE_BASE_URL}/pharmacyproducts/allPharmacyProducts`)
  .then(response => {
    // Process the retrieved data
    products = response.data;
    store.dispatch(setProducts(products));
    console.log('response: ', products);

  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.log(error);
  });



// store.dispatch(setProducts(products));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
      <PersistProvider>
        <App />
      </PersistProvider>
    </Provider>
);

