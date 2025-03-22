import React, {useEffect, useState} from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdLogout,
  MdOutlineCloudUpload,
  MdOutlineMessage,
} from "react-icons/md";
import {getAuth, updateProfile} from "firebase/auth";
import { Link, Outlet, useLocation } from "react-router-dom";
import defultAvatar from "../assets/avatar.gif";
// import {getDatabase, ref, set} from "firebase/database";
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
  const auth = getAuth();
  const [avatar, setAvatar] = useState(defultAvatar);
  // Load avatar from local storage if it exists
  useEffect(() => {
    const localAvatar = localStorage.getItem("avatar");
    if(localAvatar){
      setAvatar(localAvatar);
    }
  }, []);
  // save avatar to local storage
  useEffect(() => {
    if(avatar !== defultAvatar){
      localStorage.setItem("avatar", avatar);
    }
  }, [avatar]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const chooseFile =()=>{
    window.cloudinary.openUploadWidget({
    cloudName:"dpduokfva",
     uploadPreset: "ChattingApplication",
     sources: [ 'local', 'url', 'image_search', "google_drive"],
        googleApiKey: "AIzaSyCJgSQIchs0ImfOw4KIXqzNBLujexMOaBk",
        showAdvancedOptions: true,
        cropping: true,
        multiple: false,
        defaultSource: "local",
      searchBySites: ["all", "cloudinary.com"],
        searchByRights: true,
        maxFiles: 1,
        showUploadMoreButton: true,
    }, (error, result)=>{
      if(error){
        throw new Error(error);
      }
      if(!error && result && result.event === "success"){
        console.log("Done! Here is the image info: ", result.info, result.event);
        setAvatar(result.info.secure_url);
        // const db = getDatabase();
        const user = auth.currentUser;
        updateProfile(user, {
          photoURL: result.info.secure_url,
        });
      }
    })
  }

  const location = useLocation();
  return (
    <div className="grid grid-cols-12 py-9 px-8 h-screen w-full">
      <div className="col-span-1  bg-primary-purple rounded-[20px] py-10 flex flex-col items-center justify-between">
        <div className="object-contain rounded-full relative group ">
          <picture>
            <img
              src={avatar}
              alt={avatar}
              className="w-[70px] h-[70px] rounded-full "
            />
          </picture>
          <span onClick={chooseFile}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-90 text-3xl rounded-full p-2 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 text-primary-purple cursor-pointer"
          >
            <MdOutlineCloudUpload />
          </span>
        </div>
        <ul className="flex items-center flex-col gap-y-20 w-full">
          {navItems?.map((item) => (
            <li
              key={item.id}
              className={
                location.pathname === item.link
                  ? "text-primary-purple bg-white text-5xl cursor-pointer hover:scale-95 transition-all duration-200 hoverEffect"
                  : "text-white text-5xl cursor-pointer hover:scale-95 transition-all duration-200"
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
      <div className="col-span-1"></div>
      <div className="col-span-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
