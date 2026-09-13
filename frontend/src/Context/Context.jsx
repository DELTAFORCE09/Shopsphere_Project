import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  refreshData: () => {},
  clearCart: () => {},
  getCart: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState([]);

  // ---------------- PRODUCTS ----------------

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error.message);
    }
  };

  // ---------------- CART ----------------

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCart([]);
        return;
      }

      const response = await axios.get("/cart");

      console.log("BACKEND CART:", response.data);

      /*
       Backend returns:

       {
         id: ...,
         user: ...,
         items: [
           {
             id: ...,
             product: {
               id: ...,
               name: ...,
               price: ...,
               ...
             },
             quantity: ...
           }
         ]
       }

       Cart.jsx expects the product directly,
       so we flatten the structure here.
      */

      const cartItems = response.data.items || [];

      const formattedCart = cartItems.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));

      console.log("FORMATTED CART:", formattedCart);

      setCart(formattedCart);

    } catch (error) {
      console.error("Error fetching cart:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setCart([]);
      }
    }
  };

  // ---------------- ADD TO CART ----------------

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.post(`/cart/add/${product.id}`);

      // Get the actual cart from backend
      await getCart();

      alert("Product added to cart");

    } catch (error) {
      console.error("Error adding product to cart:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert("Please login first");
      } else {
        alert("Failed to add product to cart");
      }
    }
  };

  // ---------------- REMOVE FROM CART ----------------

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);

      await getCart();

    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // ---------------- CLEAR CART ----------------

  const clearCart = () => {
    setCart([]);
  };

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    refreshData();

    const token = localStorage.getItem("token");

    if (token) {
      getCart();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        getCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;