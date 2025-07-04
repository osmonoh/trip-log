import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/contexts";

// this component is to protect the content behind the login so that only logged in users can access it
const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);
    
    // this conditional return is because useEffect runs after the mount so before the redirection the 
    // component would actually try to render the children and only then redirect so 
    // when there is no user (!isAuthenticated) we just return null
    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
