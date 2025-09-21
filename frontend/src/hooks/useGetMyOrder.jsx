import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setMyOrders } from '../../redux/userSlice';

const useGetMyOrder = () => {
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user)
  useEffect(() => {
    const fetchorder = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(response.data))

      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchorder()
  }, [userData]);
}

export default useGetMyOrder