import React, { useState, useEffect } from "react";
import {
  Paper,
  Ste,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import { Stepper } from "@material-ui/core";
import axios from "axios";
import useStyles from "./styles";
import DeliveryForm from "../DeliveryForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import dataShipping from "../DataAddress.json";

const steps = ["Delivery", "Payment"];
const Checkout = ({ cart, user, setCart, setUser }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [checkoutToken, setCheckoutToken] = useState({});
  const [merchant, setMerchant] = useState({});
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    const getCheckOut = async (tokenID) => {
      await commerce.checkout.getLive(tokenID).then((response) => {
        setMerchant(response);
        console.log(response);
      });
    };
    const generateToken = async () => {
      const cartTemp = window.localStorage.getItem("cartTemp");
      await commerce.checkout
        .generateToken(JSON.parse(cartTemp).id, { type: "cart" })
        .then((checkout) => {
          setCheckoutToken(checkout);
          getCheckOut(checkout.id);
        });
    };

    generateToken();
  }, []);

  const getCityName = async (data) => {
    for (var i = 0; i < dataShipping.length; i++) {
      if (dataShipping[i].code === data.shippingCity) {
        setCityName(dataShipping[i].name);
      }
    }
  };

  const addNewEmptyCart = async () => {
    await commerce.cart.refresh().then((cart) => {
      setCart(cart);
      const url = "http://localhost:8000/api/user/update_cart/" + user.userID;
      axios
        .put(url, {
          cartID: cart.id,
        })
        .then((response) => {
          console.log(response);
          setUser(response.data);
          window.localStorage.setItem("user", JSON.stringify(response.data));
          // fetchCart(true, response.data)
          // window.location.reload()
        });
    });
  };

  const Confirmation = () => (
    <div>
      <input></input>
    </div>
  );

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    getCityName(data);
    setShippingData(data);
    nextStep();
  };

  console.log("ship data", shippingData);
  console.log("ship city name", cityName);
  console.log("checkout token", checkoutToken);

  const Form = () =>
    activeStep === 0 ? (
      <DeliveryForm next={next} />
    ) : (
      <PaymentForm
        cart={cart}
        back={backStep}
        next={nextStep}
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        customer={user}
        refreshCart={addNewEmptyCart}
        city={cityName}
      />
    );
  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? <Confirmation /> : <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
