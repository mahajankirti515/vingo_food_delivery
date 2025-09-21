import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverURL } from "../App";


const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
 

  useEffect(() => {
     const updateLocation = async(lat,lon) => {
        const result = await axios.post(`${serverURL}/api/user/update-location`,{lat,lon},
            {withCredentials:true}
        )
        console.log(result.data)
     }

     navigator.geolocation.watchPosition((pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude)
     })
  }, [userData]);
};

export default useUpdateLocation;
