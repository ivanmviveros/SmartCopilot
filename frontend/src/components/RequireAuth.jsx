// import { useContext } from "react"
import { useLocation, Navigate } from "react-router-dom";
// import UserContext from '../context/UserContext';

function RequireAuth({children}){
    // const {stateUser} = useContext(UserContext)
    const location = useLocation()
    const userToken = sessionStorage.getItem('userToken')
    if (userToken){
        return children
    }else{
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}
export default RequireAuth