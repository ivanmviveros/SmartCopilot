import { useContext } from "react"
import { useLocation, Navigate } from "react-router-dom";
import UserContext from '../context/UserContext';

function RequireAuth({children}){
    const {stateUser} = useContext(UserContext)
    const location = useLocation()
    if (!stateUser){
        return <Navigate to="/login" state={{ from: location }} replace />;
    }else{
        return children
    }
}
export default RequireAuth