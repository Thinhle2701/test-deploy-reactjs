import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { commerce } from "../../../lib/commerce";
const OrderItem = ({ orderID }) => {
  const [orderDetail, setOrderDetail] = useState({});
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getOrderDetail(orderID) {
      await commerce.checkout.getLive(orderID).then((response) => {
        setOrderDetail(response);
        setList(response.line_items);
      });
    }
    getOrderDetail(orderID);
  }, [orderID]);

  return (
    <>
      {/* <div>
        {orderID === "" ? (
          <p>hello</p>
        ) : (
          <div>
            <List disablePadding>
              {list.map((item) => (
                <div>
                  <ListItem key={item.product_name}>
                    <img
                      src={item.image.url}
                      style={{
                        height: "150px",
                        width: "200px",
                        marginRight: "10px",
                        marginLeft: "10px",
                      }}
                    ></img>
                    <ListItemText
                      style={{ fontSize: "30px" }}
                      primary={item.name}
                      secondary={`quantity : ${item.quantity} `}
                    />
                    <Typography variant="body2" fontSize="30px">
                      {item.line_total.formatted_with_symbol}
                    </Typography>
                  </ListItem>
                </div>
              ))}
            </List>
          </div>
        )}
      </div> */}
      <p style={{fontWeight:'bold'}}>ORDER: {orderID}</p>
      <div style={{display:'flex'}}>
      {list.map((item) => (
        <div>
          {/* <ListItem key={item.product_name}>
            <img
              src={item.image.url}
              style={{
                height: "150px",
                width: "200px",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            ></img>
            <ListItemText
              style={{ fontSize: "30px" }}
              primary={item.name}
              secondary={`quantity : ${item.quantity} `}
            />
            <Typography variant="body2" fontSize="30px">
              {item.line_total.formatted_with_symbol}
            </Typography>
          </ListItem> */}
          <div style={{textAlign:'center'}}>
          <p>{item.product_name}</p>
          <img
              src={item.image.url}
              style={{
                height: "150px",
                width: "200px",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            ></img>
          <p>quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
      </div>
    </>
  );
};

export default OrderItem;
