import axios from 'axios'
import store from '../redux/store';

const baseURL = 'http://localhost:5005'
const service = axios.create({
  baseURL,
  timeout: 50000
})
service.interceptors.request.use(
  (config) => {
    if (window.localStorage.token) {
      const token = store.getState()?.userinfo?.token || window.localStorage.token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (response) => {
    // const { code, msg } = response.data
    // console.log('response = ', response)
    return response.data
  },
  (error) => {
    // console.log('error = ', error)
    window.Toast(error.response.data.error);
    return Promise.reject(error)
  }
)

export default service
