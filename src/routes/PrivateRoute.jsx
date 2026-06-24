import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const token = localStorage.getItem("user");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;