import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Always get the product ID from one of the possible fields
  const getId = (item) => {
    return item?._id || item?.id || item?.productId || null;
  };

  // Load cart once and normalize old data
  useEffect(() => {
    try {
      const existingCart = localStorage.getItem("cart");

      if (!existingCart) return;

      const parsed = JSON.parse(existingCart);

      if (!Array.isArray(parsed)) {
        localStorage.removeItem("cart");
        return;
      }

      const normalized = parsed
        .map((item) => {
          const id = getId(item);

          if (!id) {
            console.warn("⚠️ Removing cart item with missing ID:", item);
            return null;
          }

          return {
            ...item,
            _id: id,
            quantity: Number(item.quantity) || 1,
          };
        })
        .filter(Boolean);

      setCart(normalized);

      // Save the cleaned cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(normalized));
    } catch (error) {
      console.error("❌ Error loading cart:", error);
      localStorage.removeItem("cart");
      setCart([]);
    }
  }, []);

  // Single source of truth
  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ADD TO CART
  const addToCart = (product) => {
    const id = getId(product);

    // Never allow a product without an ID into the cart
    if (!id) {
      console.error("❌ Cannot add product without ID:", product);
      return;
    }

    const exists = cart.find((item) => getId(item) === id);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        getId(item) === id
          ? {
              ...item,
              _id: id,
              quantity: Number(item.quantity || 0) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          _id: id,
          quantity: 1,
        },
      ];
    }

    syncCart(updatedCart);
  };

  // INCREASE QTY
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      getId(item) === id
        ? {
            ...item,
            quantity: Number(item.quantity || 0) + 1,
          }
        : item
    );

    syncCart(updated);
  };

  // DECREASE QTY
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        getId(item) === id
          ? {
              ...item,
              quantity: Number(item.quantity || 0) - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    syncCart(updated);
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => getId(item) !== id);

    syncCart(updated);
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };