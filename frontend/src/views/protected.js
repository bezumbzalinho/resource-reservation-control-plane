import { Navigate, Outlet } from "react-router-dom";
import AuthService from "./auth.service";
const ProtectedRoutes = () => {
  const user = AuthService.getCurrentUser();

  return user ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ProtectedRoutes;
