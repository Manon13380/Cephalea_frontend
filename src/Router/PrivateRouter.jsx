import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime; 
  } catch (error) {
    return true; 
  }
};
const PrivateRouter = () => {

    
const token = sessionStorage.getItem("token")
console.log("token" ,token)

return token  && !isTokenExpired(token) ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRouter