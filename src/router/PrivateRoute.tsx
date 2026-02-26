import { ReactNode, FC, useContext, } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context';

interface PublicRouteProps {
  children: ReactNode;
}

export const PrivateRoute: FC<PublicRouteProps> = ({ children  }) => {  
  const { isLoggedIn } = useContext(AuthContext);

  return !isLoggedIn ? <Navigate to="/" /> : children;
  
}
