import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';
import Forbidden from '../paginas/Forbidden';

const PrivateRouteWithRole = ({ children }) => {
    const { auth } = useContext(AuthContext)

    if ("cliente" === auth.rol) {
        return <Forbidden/>
    } else {
        return children
    }
}

export default PrivateRouteWithRole