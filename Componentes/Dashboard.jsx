import React from "react";
import NavBar from "./NavBar";

const Dashboard = ({ sidebarToggle, setSideBarToggle }) => {
 
  return (
    <div className={`${sidebarToggle ? "" : " ml-64 "} w-full`}>
      <NavBar
        sideBarToggle={sidebarToggle}
        setSideBarToggle={setSideBarToggle}
      />
    </div>
  );
};

export default Dashboard;
