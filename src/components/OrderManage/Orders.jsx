import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { commerce } from "../../lib/commerce";
import OrderItem from "./OrderItems/OrderItem"
import axios from "axios";
const Orders = ({ orderList }) => {
  const [orderState,setOrderState] = useState([{}])
  useEffect(() => {
    async function getOrderCustomer (userID){
      const url = "http://localhost:8000/api/order/find_order_cus/" + userID
      axios.get(url)
      .then(function (response) {
        // handle success
        setOrderState(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    }

    const user = window.localStorage.getItem("user");
    console.log(JSON.parse(user).userID);

    getOrderCustomer(JSON.parse(user).userID)

  }, []);
  

  console.log("order ne",orderState);
  return (
    <>
          <div>
          <p>hello</p>
          <input></input>
        </div>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontSize: "30px", marginTop: "100px" }}
      >
        Order 
      </Typography>

      {orderState.map((product) => (
        <div>
        <OrderItem orderID={product.orderID}/>
        </div>
    ))}
    </>
  );
};

export default Orders;
