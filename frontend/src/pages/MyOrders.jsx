import { useDispatch } from 'react-redux';
import React, { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from '../../redux/userSlice';

const MyOrders = () => {
  const navigate = useNavigate();
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if(data.shopOrders?.owner._id==userData._id){
        dispatch(setMyOrders([data,...myOrders]))
      }
    })

   socket?.on("updated-status", ({orderId,shopId,status,userId}) => {
     if(userId==userData._id){
        dispatch(updateRealtimeOrderStatus({orderId, shopId, status}))
     }
   })

    return () => {
      socket?.off("newOrder")
      socket?.off("updated-status")
    }
  }, [socket])



  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        <div className="flex items-center gap-[20px] mb-6">
          <div onClick={() => navigate("/")} className=" z-[10] ">
            <IoIosArrowRoundBack size={25} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>

        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData.role == "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role == "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
