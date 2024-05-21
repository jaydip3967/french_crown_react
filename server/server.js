const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51PIjsuRoHUaPn9T004HRftc4QZyn53K9Hg26drbakbnFzUAnwHihm5191TvDUQ7cZhFeEzPcuvkcH0d7b3zYe7Ew00g6yvTvx9")

app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    const { Products , customer} = req.body
    const lineItems = Products.map((products) => {
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: products.name,
                },
                unit_amount: products.price * 100,
            },
            quantity : 1
        }
    })
    // return console.log('lineItems', lineItems)
    try {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
            // customer_details: {
            //     name: customer.email,
            //     address: {
            //         // line1: customer.address.line1,
            //         city: customer.address.city,
            //         state: customer.address.state,
            //         postal_code: customer.address.postal_code,
            //         country: customer.address.country,
            //     },
            // },
        })
            res.json({ id: session.id })
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: error.message });
    }

})

app.listen(7000, () => {
    console.log("server start");
})