import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setItemInMyCity } from '../../redux/userSlice';

const useGetItemByCity = () => {
    const dispatch = useDispatch();
    const {currentCity} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/item/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
        dispatch(setItemInMyCity(response.data))

      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchItem()
  }, [currentCity]);
}

export default useGetItemByCity



