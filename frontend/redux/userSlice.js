import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders:[],
    searchItems:null,
    socket:null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemInMyCity: (state, action) => {
      state.itemInMyCity = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addToCart: (state, action) => {
      const cartItems = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === cartItems.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...cartItems, quantity: 1 });
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      console.log(state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    setMyOrders:(state,action)=>{
        state.myOrders=action.payload;
    },
    addMyOrders:(state, action)=>{
      state.myOrders=[action.payload, ...state.myOrders]
    },
    updateOrderStatus:(state,action)=>{
      const {orderId,shopId, status}=action.payload;
      const order = state.myOrders.find(o=>o._id==orderId);
      if(order){
        if(order.shopOrders && order.shopOrders.shop._id==shopId){
          order.shopOrders.status=status;
        }
      }
    },

    updateRealtimeOrderStatus:(state, action)=>{
      const {orderId,shopId, status}=action.payload
      const order = state.myOrders.find(o=>o._id==orderId);
      if(order){
        const shopOrder = order.shopOrders.find(o=>o.shop._id==shopId);
        if(shopOrder){
          shopOrder.status=status;
        }
      }
    },

    setSearchItems:(state, action)=>{
      state.searchItems=action.payload;
    }

  },
});

export const {
  setUserData,
  addToCart,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopInMyCity,
  setItemInMyCity,
  updateQuantity,
  removeFromCart,
  setMyOrders,
  addMyOrders,
  updateOrderStatus,
  setSearchItems,
  setSocket, updateRealtimeOrderStatus
} = userSlice.actions;
export default userSlice.reducer;
