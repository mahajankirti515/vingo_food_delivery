import { useDispatch } from 'react-redux';
import axios from 'axios'
import { useEffect } from 'react'
import { serverURL } from '../App';
import { setUserData, setLoading, setError } from '../../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    let isCancelled = false; // Prevent race conditions
    
    const fetchCurrentUser = async () => {
      try {
        dispatch(setLoading(true)); // Set loading to true before fetch
        
        const response = await axios.get(`${serverURL}/api/user/current-user`, {
          withCredentials: true,
        });
        
        // Only update state if component is still mounted
        if (!isCancelled) {
          dispatch(setUserData(response.data.user)); // Make sure it's response.data.user
          dispatch(setError(null)); // Clear any previous errors
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.log(error.response?.data?.message || error.message);
          dispatch(setUserData(null)); // Clear user data on error
          dispatch(setError(error.response?.data?.message || error.message));
        }
      } finally {
        if (!isCancelled) {
          dispatch(setLoading(false)); // Set loading to false after fetch
        }
      }
    };

    fetchCurrentUser();
    
    // Cleanup function to prevent race conditions
    return () => {
      isCancelled = true;
    };
  }, [dispatch]); // Include dispatch in dependency array
}

export default useGetCurrentUser;
