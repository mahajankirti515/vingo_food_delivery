import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setMyShopData } from '../../redux/ownerSlice';

const useGetMyShop = () => {
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(response.data))

      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchShop()
  }, [userData]);
}

export default useGetMyShop