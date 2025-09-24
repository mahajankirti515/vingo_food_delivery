import { useDispatch } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setUserData, setLoading, setError } from '../../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    let isCancelled = false;
    
    const fetchCurrentUser = async () => {
      try {
        dispatch(setLoading(true));
        
        const response = await axios.get(`${serverURL}/api/user/current-user`, {
          withCredentials: true,
        });
        
        if (!isCancelled) {
          dispatch(setUserData(response.data.user)); // Make sure it's response.data.user
          dispatch(setError(null));
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.log(error.response?.data?.message || error.message);
          dispatch(setUserData(null));
          dispatch(setError(error.response?.data?.message || error.message));
        }
      } finally {
        if (!isCancelled) {
          dispatch(setLoading(false));
        }
      }
    };

    fetchCurrentUser();
    
    return () => {
      isCancelled = true;
    };
  }, [dispatch]);
}

export default useGetCurrentUser;
