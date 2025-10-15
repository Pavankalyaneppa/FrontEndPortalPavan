import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import { useSelector } from 'react-redux';
import Login from "../authentication/Login";

const Dashboard = () => {
  // const navigate = useNavigate();
  // const authorities = useSelector(state => state.authentication.user?.authorities || []);
  
  // const authorityInfo = authorities.map(auth => ({
  //   id: auth.id,
  //   rolename: auth.rolename
  // }));
  
  // const logindata = authorityInfo[0]?.id;

  // // Optionally, handle cases where logindata is undefined or a different value
  // if (!logindata) {
  //   return <Login />;
  // }

  return (
    <div>
      {/* {logindata === 1 ? ( */}
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      {/* ) : (
        navigate("/login")
      )} */}
    </div>
  );
};

export default Dashboard;
