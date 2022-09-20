import React, { useState, useEffect, useReducer } from "react";
import {
  Products,
  Navbar,
  Cart,
  ProductDetail,
  Checkout,
  ProductCompare,
  LoginModal,
  SignUp,
  Orders,
} from "./components";
import axios from "axios";
import Modal from "react-modal";
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const api = axios.create({
  baseURL: `http://localhost:8000/`,
});
const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [userLogin, SetUserLogin] = useState({});
  const [loginSuccess, SetLoginSuccess] = useState(false);
  const [loginType, setLoginType] = useState("");
  const [urlAvatar, setURLAvatar] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState({});
  const [testOrder, setTestOrder] = useState({});

  useEffect(() => {
    const check = window.localStorage.getItem("checkLogin");
    const user = window.localStorage.getItem("user");
    SetLoginSuccess(JSON.parse(check));

    if (JSON.parse(check) !== null) {
      const ava = window.localStorage.getItem("urlAvatar");
      setURLAvatar(JSON.parse(ava));
      SetUserLogin(JSON.parse(user));
      getOrderCustomer(JSON.parse(user).userID);
      fetchCart(JSON.parse(check), JSON.parse(user));
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
    console.log(data);
  };

  const searchProduct = async (productName) => {
    const { data } = await commerce.products.list();

    var ProductSearch = [];
    console.log("SearchTitle: ", productName);
    if (productName == "") {
      setProducts(data);
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().includes(productName.toLowerCase())) {
        ProductSearch.push(data[i]);
      }
    }
    setProducts(ProductSearch);
  };

  const filterProduct = async (productCategory) => {
    const { data } = await commerce.products.list();
    var ProductFilter = [];
    if (productCategory == "All") {
      setProducts(data);
    } else {
      console.log("Filter: ", productCategory);
      for (var i = 0; i < data.length; i++) {
        if (data[i].categories[0].name == productCategory) {
          ProductFilter.push(data[i]);
        }
      }
      setProducts(ProductFilter);
    }
  };

  const addNewEmptyCart = async () => {
    await commerce.cart.refresh().then((cart) => {
      setCart(cart);
      window.localStorage.setItem("cartTemp", JSON.stringify(cart));
    });
  };
  const filterCategory = async (productCategory, flag) => {
    const { data } = await commerce.products.list();
    if (flag === false) {
      setProducts(data);
    } else {
      var ProductFilter = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].categories[0].name === productCategory) {
          ProductFilter.push(data[i]);
        }
      }
      setProducts(ProductFilter);
    }
  };

  const fetchCart = async (checkLogin, user) => {
    if (checkLogin === false) {
      commerce.cart.retrieve().then((cart) => {
        setCart(cart);
        window.localStorage.setItem("cartTemp", JSON.stringify(cart));
      });
    } else {
      const url = "https://api.chec.io/v1/carts/" + user.cartID;
      axios
        .get(url, {
          headers: {
            "X-Authorization":
              "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
          },
        })
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => {
          console.log("error " + error);
        });
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    if (loginSuccess === false) {
      const { cart } = await commerce.cart.add(productId, quantity);
      window.localStorage.setItem("cartTemp", JSON.stringify(cart));
      setCart(cart);
    } else {
      const url = "https://api.chec.io/v1/carts/" + userLogin.cartID;
      axios
        .post(
          url,
          {
            id: productId,
            quantity: quantity,
          },
          {
            headers: {
              "X-Authorization":
                "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
            },
          }
        )
        .then((res) => {
          setCart(res.data.cart);
          window.localStorage.setItem(
            "cartTemp",
            JSON.stringify(res.data.cart)
          );
        });
    }
  };

  const handleUpdateCartQty = async (itemID, quantity) => {
    const cartTemp = window.localStorage.getItem("cartTemp");
    if (loginSuccess === false) {
      const url =
        "https://api.chec.io/v1/carts/" +
        JSON.parse(cartTemp).id +
        "/items/" +
        itemID;
      axios
        .put(
          url,
          {
            quantity: quantity,
          },
          {
            headers: {
              "X-Authorization":
                "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setCart(res.data.cart);
          window.localStorage.setItem(
            "cartTemp",
            JSON.stringify(res.data.cart)
          );
        });
    } else {
      const url =
        "https://api.chec.io/v1/carts/" + userLogin.cartID + "/items/" + itemID;
      axios
        .put(
          url,
          {
            quantity: quantity,
          },
          {
            headers: {
              "X-Authorization":
                "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setCart(res.data.cart);
          window.localStorage.setItem(
            "cartTemp",
            JSON.stringify(res.data.cart)
          );
        });
    }
  };

  const handleRemoveFromCart = async (itemID) => {
    if (loginSuccess === false) {
      const { cart } = await commerce.cart.remove(itemID);
      setCart(cart);
    } else {
      const url =
        "https://api.chec.io/v1/carts/" + userLogin.cartID + "/items/" + itemID;
      axios
        .delete(url, {
          headers: {
            "X-Authorization":
              "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
          },
        })
        .then((res) => {
          setCart(res.data.cart);
          window.localStorage.setItem(
            "cartTemp",
            JSON.stringify(res.data.cart)
          );
        });
    }
  };

  const handleEmptyCart = async () => {
    if (loginSuccess === false) {
      const { cart } = await commerce.cart.empty();
      setCart(cart);
    } else {
      const url =
        "https://api.chec.io/v1/carts/" + userLogin.cartID + "/items/";
      axios
        .delete(url, {
          headers: {
            "X-Authorization":
              "pk_4513267273233fc7080de820c6f5b5630e0fadf031a5a",
          },
        })
        .then((res) => {
          setCart(res.data.cart);
          window.localStorage.setItem(
            "cartTemp",
            JSON.stringify(res.data.cart)
          );
        });
    }
  };

  const handleProductDetail = async (product) => {
    // console.log(product);
    // // setDetail(product);
  };

  const handleAfterCloseLogin = async (Type, user, checkLogin) => {
    if (checkLogin === true) {
      if (Type === "normal") {
        setURLAvatar(userLogin.url);
        window.localStorage.setItem("urlAvatar", JSON.stringify(userLogin.url));
        // console.log("user",userLogin)
        // fetchCart(checkLogin, userLogin);
      } else if (Type === "google") {
        setURLAvatar(userLogin.picture);
        window.localStorage.setItem(
          "urlAvatar",
          JSON.stringify(userLogin.picture)
        );
        const cartTemp = window.localStorage.getItem("cartTemp");
        if (JSON.parse(cartTemp) !== null) {
          axios
            .post("http://localhost:8000/api/user/add_user_external", {
              username: userLogin.name,
              email: userLogin.email,
              login_type: "google",
              password: " ",
              url: userLogin.picture,
              cartID: JSON.parse(cartTemp).id,
            })
            .then(async (response) => {
              window.location.reload();
              window.localStorage.setItem(
                "user",
                JSON.stringify(response.data.data)
              );
              SetUserLogin(response.data.data);
            })
            .catch((err) => {
              if (err.response.data.message === "Username is already exists") {
                axios
                  .post("http://localhost:8000/api/user/find_google_account", {
                    username: userLogin.name,
                    email: userLogin.email,
                  })
                  .then(async (res) => {
                    // SetUserLogin(res.data);
                    // window.localStorage.setItem(
                    //   "user",
                    //   JSON.stringify(res.data)
                    // );
                    // fetchCart(true, res.data);
                    const url =
                      "http://localhost:8000/api/user/update_cart/" +
                      res.data.userID;
                    axios
                      .put(url, {
                        cartID: JSON.parse(cartTemp).id,
                      })
                      .then((response) => {
                        console.log(response);
                        SetUserLogin(response.data);
                        window.localStorage.setItem(
                          "user",
                          JSON.stringify(response.data)
                        );
                        fetchCart(true, response.data);
                        window.location.reload();
                      });
                  });
              }
              console.log(err);
            });
        } else {
          commerce.cart.refresh().then((cart) => {
            axios
              .post("http://localhost:8000/api/user/add_user_external", {
                username: userLogin.name,
                email: userLogin.email,
                login_type: "google",
                password: " ",
                url: userLogin.picture,
                cartID: cart.id,
              })
              .then(async (response) => {
                window.localStorage.setItem(
                  "user",
                  JSON.stringify(response.data.data)
                );
                SetUserLogin(response.data.data);
                window.location.reload();
                console.log(response.data);
              })
              .catch((err) => {
                if (
                  err.response.data.message === "Username is already exists"
                ) {
                  axios
                    .post(
                      "http://localhost:8000/api/user/find_google_account",
                      {
                        username: userLogin.name,
                        email: userLogin.email,
                      }
                    )
                    .then(async (res) => {
                      SetUserLogin(res.data);
                      window.localStorage.setItem(
                        "user",
                        JSON.stringify(res.data)
                      );
                      fetchCart(true, res.data);
                    });
                }
                console.log(err);
              });
          });
        }
      } else if (Type === "facebook") {
        setURLAvatar(userLogin.picture.data.url);
        window.localStorage.setItem(
          "urlAvatar",
          JSON.stringify(userLogin.picture.data.url)
        );
        addNewEmptyCart();

        // axios.post("http://localhost:8000/api/user/add_user_external", {
        //   username: userLogin.name,
        //   email: userLogin.email,
        //   login_type: "facebook",
        //   url: userLogin.picture.data.url,
        // });
      }

      window.localStorage.setItem("checkLogin", JSON.stringify(checkLogin));
      // window.localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const getOrders = async () => {
    await commerce.checkout
      .getLive("chkt_RyWOwm9QBGwnEa")
      .then((response) => setTestOrder(response));
  };
  getOrders();

  const getOrderCustomer = async (userID) => {
    const url = "http://localhost:8000/api/order/find_order_cus/" + userID;
    axios
      .get(url)
      .then(function (response) {
        // handle success
        setOrder(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "390px",
      width: "810px",
      backgroundColor: "white",
      borderColor: "black",
    },
  };
  // console.log(userLogin)
  // console.log("Login",loginSuccess)
  // console.log(loginType)
  // console.log("url",urlAvatar)

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Router>
      <div>
        <Navbar
          // totalItems={cart.total_items}
          handleSearchItem={searchProduct}
          products={products}
          setOpenModal={setModalOpen}
          LoginUser={userLogin}
          checkLogin={loginSuccess}
          setLogin={SetLoginSuccess}
          setLoginUser={SetUserLogin}
          typeLogin={loginType}
          avatarURL={urlAvatar}
          numberItem={cart.total_items}
        />

        {modalOpen === true ? (
          <Modal
            isOpen={modalOpen}
            style={customStyles}
            ariaHideApp={false}
            onAfterClose={() =>
              handleAfterCloseLogin(loginType, userLogin, loginSuccess)
            }
          >
            <LoginModal
              setOpenModal={setModalOpen}
              setLoginUser={SetUserLogin}
              setSuccessLogin={SetLoginSuccess}
              setTypeLogin={setLoginType}
              SetURL={setURLAvatar}
            />
          </Modal>
        ) : (
          <p></p>
        )}

        <Switch>
          <Route exact path="/">
            <Products
              products={products}
              onAddToCart={handleAddToCart}
              onDetailProduct={handleProductDetail}
              handleFilterProduct={filterProduct}
              handleFilterCategory={filterCategory}
            />
          </Route>
          <Route exact path="/Signup">
            <SignUp />
          </Route>

          <Route exact path="/cart">
            <Cart
              cart={cart}
              checkLogin={loginSuccess}
              setOpenModal={setModalOpen}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          {/* 
          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              user={userLogin}
              setCart={setCart}
              setUser={SetUserLogin}
            />
            <Checkout />
          </Route> */}

          <Route
            path="/checkout"
            render={() => (
              <Checkout
                cart={cart}
                order={order}
                user={userLogin}
                setCart={setCart}
                setUser={SetUserLogin}
              />
            )}
          />

          <Route exact path="/detail/:productId">
            <ProductDetail ProductList={products} AddToCart={handleAddToCart} />
          </Route>

          <Route exact path="/compare">
            <ProductCompare products={products} />
          </Route>

          <Route exact path="/order">
            <Orders orderList={order} />
          </Route>
        </Switch>

        <p style={{ fontSize: "30px" }}>{}</p>
      </div>
    </Router>
  );
};

export default App;
