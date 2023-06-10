import React, { Fragment, useEffect } from 'react';
import LayoutOne from '../../layouts/LayoutOne';
import { Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteAllFromCart } from '../../store/slices/cart-slice';
import { useState } from 'react';

const CheckoutSuccess = () => {

  const url = `http://localhost:9002/paymentlogs/addNewPaymentLog`
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [totalQuantity, setTotalQuantity] = useState();
  const [quantityByProduct, setQuantityByProduct] = useState();

  useEffect(() => {
    // You can call your desired function here
    const paymentSuccess = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      setTotalPrice(JSON.parse(params.totalPrice));
      console.log("Total Price: ", JSON.parse(params.totalPrice));
      setTotalQuantity(JSON.parse(params.totalQuantity));
      console.log("Total Quantity: ", JSON.parse(params.totalQuantity));
      setQuantityByProduct(JSON.parse(params.quantityByPrice));
      console.log("Quantity By Price: ", JSON.parse(params.quantityByPrice));
      // setQuantityByProduct(Object.entries(quantityByProduct).map(([name, quantity]) => ({ name, quantity })));
      // console.log(JSON.parse(params.cart));

      // if (JSON.parse(params.cart)) {
      //   // CREATE A PAYMENT RECORD

      // }
    };
    paymentSuccess();
    dispatch(deleteAllFromCart()); 
  }, []);

  const paymentLog = {
    TotalAmount : totalPrice,
    TotalProducts: totalQuantity,
    QuantityByProduct: quantityByProduct,
  }
  console.log("PaymentLog: ",paymentLog);

  // const formattedQuantityByProduct = Object.keys(quantityByProduct).map((name) => ({
  //   name,
  //   quantity: quantityByProduct[name],
  // }));
  
  
    // const formattedPaymentLogData = {
    //   ...paymentLog,
    //   QuantityByProduct: formattedQuantityByProduct,
    // };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentLog)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Payment logs saved successfully:', data);
      })
      .catch(error => {
        console.error('Error saving payment logs:', error);
      });

  // postData(url, paymentData);

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