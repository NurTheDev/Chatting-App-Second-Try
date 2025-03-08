import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { MdLogout, MdOutlineMessage } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
const navItems = [
  { id: 1, name: "Home", link: "/home", icon: <IoHomeOutline /> },
  { id: 2, name: "Messages", link: "/messages", icon: <MdOutlineMessage /> },
  {
    id: 3,
    name: "Notifications",
    link: "/notifications",
    icon: <IoMdNotificationsOutline />,
  },
  { id: 4, name: "Settings", link: "/settings", icon: <IoSettingsOutline /> },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="grid grid-cols-12 py-9 px-8 h-screen">
      <div className="col-span-2 w-8/12 bg-primary-purple rounded-[20px] py-10 flex flex-col items-center justify-between">
        <div className="object-contain rounded-full">
          <picture>
            <img
              src="https://freesvg.org/img/abstract-user-flat-4.png"
              alt=""
              className="w-[70px] h-[70px] rounded-full"
            />
          </picture>
        </div>
        <ul className="flex items-center flex-col gap-y-20 w-full">
          {navItems?.map((item) => (
            <li
              key={item.id}
              className={
                location.pathname === item.link
                  ? "text-primary-purple bg-white text-5xl cursor-pointer shadow-2xl hover:scale-95 transition-all duration-200 hoverEffect"
                  : "text-white text-5xl cursor-pointer shadow-2xl hover:scale-95 transition-all duration-200"
              }
            >
              <Link to={item.link}>{item.icon}</Link>
            </li>
          ))}
        </ul>
        <Link
          to="/login"
          className="text-white text-5xl cursor-pointer shadow-2xl hover:scale-95 transition-all duration-100"
        >
          <MdLogout />
        </Link>
      </div>
      <div className="col-span-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
