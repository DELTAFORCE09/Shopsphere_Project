import React, { useContext, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    getCart,
  } = useContext(AppContext);

  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setCheckingOut(true);

      const response = await axios.post("/orders/checkout");

      console.log("ORDER CREATED:", response.data);

      alert(
        `Order placed successfully!\nOrder ID: ${response.data.id}\nTotal: ₹${response.data.totalAmount}`
      );

      // Backend already clears the cart.
      // Refresh frontend cart from backend.
      await getCart();

    } catch (error) {
      console.error("Checkout failed:", error);

      if (error.response?.status === 400) {
        alert(error.response.data);
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert("Please login first");
      } else {
        alert("Checkout failed. Please try again.");
      }
    } finally {
      setCheckingOut(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div
        style={{
          marginTop: "5rem",
          marginLeft: "auto",
          marginRight: "auto",
          width: "70%",
          minHeight: "300px",
          padding: "5rem",
          textAlign: "center",
          backgroundColor: "#222",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <h2>Shopping Cart</h2>

        <hr />

        <h4 style={{ marginTop: "3rem" }}>
          Your cart is empty
        </h4>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => {
    return (
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1)
    );
  }, 0);

  return (
    <div
      style={{
        marginTop: "5rem",
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
        padding: "2rem",
        backgroundColor: "#222",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Shopping Cart</h2>

        <button
          onClick={clearCart}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "0.6rem 1rem",
            borderRadius: "5px",
          }}
        >
          Clear Cart
        </button>
      </div>

      <hr />

      {cart.map((item) => {
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#2c2c2c",
              borderRadius: "8px",
            }}
          >
            <div>
              <h4>{item.name}</h4>

              <p>
                Brand: {item.brand}
              </p>

              <p>
                Price: ₹{item.price}
              </p>

              <p>
                Quantity: {item.quantity || 1}
              </p>

              <p>
                Subtotal: ₹
                {Number(item.price) *
                  Number(item.quantity || 1)}
              </p>
            </div>

            <button
              onClick={() =>
                removeFromCart(item.id)
              }
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "0.7rem 1rem",
                borderRadius: "5px",
              }}
            >
              Remove
            </button>
          </div>
        );
      })}

      <hr />

      <div
        style={{
          textAlign: "right",
          marginTop: "1.5rem",
        }}
      >
        <h3>
          Total: ₹{total.toFixed(2)}
        </h3>

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          style={{
            backgroundColor: checkingOut
              ? "#6c757d"
              : "#007bff",
            color: "white",
            border: "none",
            padding: "0.8rem 2rem",
            borderRadius: "5px",
            marginTop: "1rem",
            cursor: checkingOut
              ? "not-allowed"
              : "pointer",
          }}
        >
          {checkingOut
            ? "Processing..."
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;