import React from "react";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/userSlice";

const CartItemCard = ({ data }) => {

  const dispatch = useDispatch()

  const handleIncrement = (id,currentQty) => {
      dispatch(updateQuantity({id, quantity: currentQty + 1}))
  }

  const handleDecrement = (id,currentQty) => {
    if(currentQty>1){
       dispatch(updateQuantity({id, quantity: currentQty - 1}))
    }
  }


  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt=""
          className="w-16 h-16 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-gray-800 font-medium">{data.name}</h1>
          <p className="text-gray-500 text-sm">
            ₹{data.price} x {data.quantity}
          </p>
          <p className="font-bold text-gray-900">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3"> 
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => handleDecrement(data.id,data.quantity)}
        >
          <FaMinus size={12} />
        </button>
        <span>{data.quantity}</span>
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer "
          onClick={() => handleIncrement(data.id,data.quantity)}
        >
          <FaPlus size={12} />
        </button>
        <button 
          onClick={() => dispatch(removeFromCart(data.id))}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer">
          <CiTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
