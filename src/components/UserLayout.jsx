import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex flex-row min-h-screen">

      {/* sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

     
    </div>
  );
};

export default UserLayout;