import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});
  const formatData = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    // Immediately update UI
    setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));
    
    try {
      const result = await axios.post(
        `${serverURL}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );
      console.log("Rating saved:", result.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">order #{data._id?.slice(-6)}</p>
          {/* <p className="text-sm text-gray-500">{formatData(data.createdAt)}</p> */}
          <p className="text-sm text-gray-500">
            {data.createdAt ? formatData(data.createdAt) : "--"}
          </p>
        </div>
        <div className="text-right">
          {data.paymentMethod == "cod" ? (
            <p className="text-sm text-gray-500">
              {data.paymentMethod?.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              {data.payment ? "true" : "false"}
            </p>
          )}
          <p className="font-medium text-blue-600">
            {data.shopOrders?.[0]?.status}
          </p>
        </div>
      </div>

      {data.shopOrders?.map((shopOrder, index) => (
        <div
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          key={index}
        >
          <p>{shopOrder.shop.name}</p>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder?.shopOrderItems?.map((item, index) => (
              <div
                className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                key={index}
              >
                <img
                  src={item.item.image}
                  alt={item.item.name}
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty : {item.quantity} x ₹{item.price}
                </p>

                {shopOrder.status == "delivered" && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`text-lg ${
                          selectedRating[item.item._id] >= star
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onClick={() => handleRating(item.item._id, star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">Subtotal : {shopOrder.subtotal}</p>
            <span className="text-sm font-medium text-blue-600">
              status : {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total : ₹{data.totalAmount}</p>
        <button
          onClick={() => navigate(`/track-order/${data._id}`)}
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
