import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(
        item => item.id === action.payload.id && item.selectedColor === action.payload.selectedColor && item.selectedSize === action.payload.selectedSize
      );

      if (existingItemIndex >= 0) {
        const updatedCart = state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return updatedCart;
      } else {
        return [...state, action.payload];
      }

    case 'REMOVE_FROM_CART':
      return state.filter(item => !(item.id === action.payload.id && item.selectedColor === action.payload.selectedColor && item.selectedSize === action.payload.selectedSize));

    case 'INCREMENT_ITEM':
      return state.map(item =>
        item.id === action.payload.id && item.selectedColor === action.payload.selectedColor && item.selectedSize === action.payload.selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREMENT_ITEM':
      return state.map(item =>
        item.id === action.payload.id && item.selectedColor === action.payload.selectedColor && item.selectedSize === action.payload.selectedSize
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeItemFromCart = (id, selectedColor, selectedSize) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedColor, selectedSize } });
  };

  const incrementItem = (id, selectedColor, selectedSize) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: { id, selectedColor, selectedSize } });
  };

  const decrementItem = (id, selectedColor, selectedSize) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: { id, selectedColor, selectedSize } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, incrementItem, decrementItem, clearCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);