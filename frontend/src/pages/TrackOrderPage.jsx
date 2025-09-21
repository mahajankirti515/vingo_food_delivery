import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();
  const { socket } = useSelector(state=>state.user)
  const [liveLocations, setLiveLocations] = useState({})

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    if(!socket) return;
    
    socket.on("update-location",({userId, latitude, longitude})=>{
      setLiveLocations((prev)=>({
        ...prev,
        [userId]:{lat:latitude, lon:longitude}
      }))
    })
    
    return () => {
      socket.off("update-location");
    }
  },[socket])

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        onClick={() => navigate("/")}
        className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]"
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-200 space-y-4"
          key={index}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]]">
              {shopOrder.shop.name}
            </p>
            <p>
              <span>Items : </span>
              {shopOrder.shopOrderItems?.map((i) => i.name).join(",")}
            </p>
            <p>
              <span className="font-semi-bold">Subtotal : </span>
              {shopOrder?.subtotal}
            </p>
            <p className="mt-6">
              <span className="font-semi-bold">Delivery address : </span>
              {currentOrder?.deliveryAddress?.text}
            </p>
          </div>

          {shopOrder.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    <span>Delivery Boy Name : </span>
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Delivery Boy Contact No. : </span>
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p>Delivery Boy is not assignedyet.</p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold test-lg">Delivered</p>
          )}

         {(shopOrder.assignedDeliveryBoy && shopOrder.status !=="delivered") &&
           <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
              <DeliveryBoyTracking data={{
                deliveryBoyLocation:liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                    lat:shopOrder.assignedDeliveryBoy.location.coordinates[1],
                    lon:shopOrder.assignedDeliveryBoy.location.coordinates[0],
                },
                customerLocation:{
                    lat:currentOrder.deliveryAddress.latitude,
                    lon:currentOrder.deliveryAddress.longitude,
                }
              }} />
           </div>
         }

        </div>
      ))}
    </div>
  );
};

export default TrackOrderPage;
