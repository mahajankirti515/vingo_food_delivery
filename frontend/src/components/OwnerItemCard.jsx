import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { setMyShopData } from "../../redux/ownerSlice";


const OwnerItemCard = ({ data }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleDelete = async(id) => {
    try {
       const res = await axios.delete(`${serverURL}/api/item/delete/${data._id}`,{
      withCredentials: true
    })
    dispatch(setMyShopData(res.data))
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      <div className="w-36 flex-shrink-0 bg-gray-50">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div className="">
          <h2 className="text-base font-semibold text-[#ff4d2d]">
            {data.name}
          </h2>
          <p>
            <span className="font-medium text-gray-70">Category :</span>{" "}
            {data.category}
          </p>
          <p>
            <span className="font-medium text-gray-70">Food Type :</span>{" "}
            {data.foodType}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[#ff4d2d] font-bold">{data.price}</div>

          <div className="flex items-center gap-2">
            <div
              className="flex curdor-pointer text-[#ff4d2d] hover:bg-[#ff4d2d]/10 p-2 rounded-full"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen />
            </div>
            <div 
            className="flex curdor-pointer text-[#ff4d2d] hover:bg-[#ff4d2d]/10 p-2 rounded-full"
            onClick={handleDelete}
            >
              <FaTrashAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
