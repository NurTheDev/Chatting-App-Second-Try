import React from "react";
import { Outlet } from "react-router-dom";
const Sidebar = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
