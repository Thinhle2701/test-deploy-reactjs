import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import axios from "axios";
import { Typography, Button, Divider, Checkbox } from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const PaymentForm = ({
  cart,
  next,
  back,
  shippingData,
  checkoutToken,
  customer,
  refreshCart,
  city,
}) => {
  console.log(cart);
  console.log("shipping data", shippingData);
  const [checkCOD, setCheckCOD] = useState(true);
  const [checkCard, setCheckCard] = useState(false);
  console.log("cod: ", checkCOD);
  console.log("card: ", !checkCOD);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const currentDate =
      time +
      " " +
      `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    var type_payment = "";
    console.log("user: ", customer);
    if (checkCOD === true) {
      type_payment = "COD";
    } else {
      type_payment = "Card";
    }
    await axios
      .post("http://localhost:8000/api/order/add_order", {
        orderID: checkoutToken.id,
        customerID: customer.userID,
        total: checkoutToken.live.subtotal.formatted_with_symbol,
        paymentType: type_payment,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        city: city,
        district: shippingData.shippingDistrict,
        ward: shippingData.shippingWard,
        address: shippingData.address,
        date: currentDate,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

    refreshCart();
    next();
  };

  return (
    <>
      <ReviewForm cart={cart} checkoutToken={checkoutToken} />
      <Divider />
      <div style={{ display: "flex" }}>
        <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
          Payment Method
        </Typography>
        <div
          style={{
            display: "flex",
            border: "2px solid blue",
            paddingRight: "50px",
            borderRadius: "20px",
            margin: "5px",
            marginLeft: "20%",
          }}
        >
          <input
            style={{
              width: "20px",
              height: "20px",
              margin: "25px",
              accentColor: "blue",
            }}
            type="checkbox"
            defaultChecked={true}
            checked={checkCOD}
            onChange={() => {
              setCheckCard(checkCOD);
              setCheckCOD(!checkCOD);
            }}
          />
          <div style={{ marginTop: "25px", display: "flex" }}>
            <img
              style={{ height: "20px", width: "20px" }}
              src="https://lzd-img-global.slatic.net/g/tps/tfs/TB1ZP8kM1T2gK0jSZFvXXXnFXXa-96-96.png_2200x2200q75.jpg_.webp"
            ></img>
            <p style={{ marginTop: "0px", paddingLeft: "5px" }}>
              Cash On Delivery
            </p>
          </div>
          <br />
        </div>

        <div
          style={{
            display: "flex",
            border: "2px solid green",
            paddingRight: "50px",
            borderRadius: "20px",
            margin: "5px",
            marginLeft: "20%",
          }}
        >
          <input
            style={{
              width: "20px",
              height: "20px",
              margin: "25px",
              accentColor: "green",
            }}
            type="checkbox"
            defaultChecked={false}
            checked={checkCard}
            onChange={() => {
              setCheckCOD(checkCard);
              setCheckCard(!checkCard);
            }}
          />
          <div style={{ marginTop: "25px", display: "flex" }}>
            <img
              style={{ height: "20px", width: "20px" }}
              src="https://lzd-img-global.slatic.net/g/tps/tfs/TB1Iey_osKfxu4jSZPfXXb3dXXa-96-96.png_2200x2200q75.jpg_.webp"
            ></img>
            <p
              style={{
                marginTop: "0px",
                paddingLeft: "5px",
                color: "green",
                fontWeight: "bold",
              }}
            >
              Cash On Delivery
            </p>
          </div>
          <br />
        </div>
      </div>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              {checkCard === true ? (
                <div>
                  <CardElement />
                  <br /> <br />{" "}
                </div>
              ) : (
                <p>you will recieve after</p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={back}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!stripe}
                  color="primary"
                >
                  Checkout
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
