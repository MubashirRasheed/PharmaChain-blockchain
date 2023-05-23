// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

import express from 'express';
import Stripe from 'stripe';

const app = express();

// require("dotenv").config();
const stripe = Stripe('sk_test_51N8MhvAIis1NmKVj00fVQbXAoc24J7sNTNKef6MQiEpyZhzgD3npBYdzEwsKSd4kzl6VDeOy7Jyq9JeLgJsr4jxh006qzEM2b2')

const stripeRouter = express.Router();


stripeRouter.post('/create-checkout-session', async (req, res) => {


  const cart = req.body.cartItems.map((item) => 
(
  {name : item.name, id: item.id, price: item.price, quantity: item.quantity, discount: item.discount}
));

const stringCart = JSON.stringify(cart);

  const stringified = JSON.stringify(req.body.cartItems);
  console.log(req.body.cartItems);
  console.log(stringified);
    const line_items = req.body.cartItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                  name: item.name,
                  images: [item.image[0]],
                  description: item.desc,
                  metadata: {
                    id: item.id,
                  }
                },
                unit_amount: Math.round(item.price * (100 - item.discount)),
              },
              quantity: item.quantity,
        }
    })

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
            allowed_countries: ['US', 'CA', 'KY'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success?name=ismaeel&cart=${stringCart}`, //&cart=${stringified}
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({url: session.url});
});

export default stripeRouter;