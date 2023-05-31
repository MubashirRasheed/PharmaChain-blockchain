import React, { Fragment, useEffect } from 'react';
import LayoutOne from '../../layouts/LayoutOne';
import { Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteAllFromCart } from '../../store/slices/cart-slice';
import { useState } from 'react';

const CheckoutSuccess = () => {

  const url = `${import.meta.env.VITE_BASE_URL}/paymentlogs/addNewPaymentLog`
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState();

  useEffect(() => {
    // You can call your desired function here
    const paymentSuccess = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      console.log(JSON.parse(params.cart), "json");
      setCartData(JSON.parse(params.cart));
      // console.log(JSON.parse(params.cart));

      if (JSON.parse(params.cart)) {
        // CREATE A PAYMENT RECORD

      }
    };
    paymentSuccess();
    // dispatch(deleteAllFromCart()); 
  }, []);


  async function postData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
    
      const responseData = await response.json();
      console.log('Response:', responseData);
      // Handle the response data
    
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }
  }

  // Calculate total amount of price
  const totalPrice = cartData.reduce((total, item) => {
    const discountedPrice = item.price * (item.discount / 100);
    const amount = discountedPrice * item.quantity;
    return total + amount;
  }, 0);

  // Calculate total number of quantity sold
  const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);

  // Calculate number of quantity sold for each product with its name
  const quantityByProduct = cartData.reduce((result, item) => {
    if (result[item.name]) {
      result[item.name] += item.quantity;
    } else {
      result[item.name] = item.quantity;
    }
    return result;
  }, {});

  const paymentData = {
    TotalAmount : totalPrice,
    TotalProducts: totalQuantity,
    QuantityByProduct: quantityByProduct,
  }

  postData(url, paymentData);


  return (
    <>
      <Fragment>
        <LayoutOne
          headerContainerClass="container-fluid"
          headerPaddingClass="header-padding-2"
          headerTop="visible"
        >
          <div style={{ textAlign: 'center', marginLeft: '250px' }} >
            {/* <h1 style={{textAlign: 'center', font: "10px"}}>CheckoutSuccess</h1> */}
            <label style={{ fontSize: '40px', fontWeight: 'bold' }}>Payment Sucessful</label>
            <Image src="https://cdn.dribbble.com/users/2185205/screenshots/7886140/02-lottie-tick-01-instant-2.gif" width="800px" height="600px" />
          </div>
        </LayoutOne>
      </Fragment>
    </>
  )
}

export default CheckoutSuccess;