import { useDispatch } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setUserData } from '../../redux/userSlice';

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setUserData(response.data))

      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchCurrentUser()
  }, []);
}

export default useGetCurrentUser