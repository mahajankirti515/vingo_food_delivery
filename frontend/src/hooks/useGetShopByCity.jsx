import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setShopInMyCity } from '../../redux/userSlice';

const useGetShopByCity = () => {
    const dispatch = useDispatch();
    const {currentCity} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/shop/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
        dispatch(setShopInMyCity(response.data))

      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchShops()
  }, [currentCity]);
}

export default useGetShopByCity