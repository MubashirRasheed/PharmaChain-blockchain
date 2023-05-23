import axios from 'axios';
import { useSelector } from 'react-redux';
// import { url } from '../slices/api';
import React from 'react'
import { Link } from 'react-router-dom';

const PayButton = ({ cartItems, discountedP }) => {

    const url = `http://localhost:9002`
    // const user = useSelector( (state) => state.auth)


    const handleCheckout = () => {

        axios
            .post(`${url}/stripe/create-checkout-session`, {
                cartItems,
                discountedP,
                // usreId: user._id,
            })
            .then((response) => {
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div>
            <Link
                className="default-btn"
                onClick={() => handleCheckout()} >
                Check Out
            </Link>
        </div>
    )
}

export default PayButton
