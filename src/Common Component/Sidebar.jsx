import React, {useEffect, useState} from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdLogout,
  MdOutlineCloudUpload,
  MdOutlineMessage,
} from "react-icons/md";
import {getAuth, signOut, onAuthStateChanged} from "firebase/auth";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import defultAvatar from "../assets/avatar.gif";
import {getDatabase, onValue, ref, update} from "firebase/database";
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
  const [user, setUser] = useState(null);
    const navigate = useNavigate();
  const [avatar, setAvatar] = useState(defultAvatar)
  const [currentUser, setCurrentUser] = useState(null);
  // Load avatar from local storage if it exists
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (authUser)=>{
      if(authUser){
        setCurrentUser(authUser);
      }
      else{
        navigate("/login");
      }
    })
    return () => {
      unsubscribed();
    }
  }, []);
  useEffect(() => {
    if(!currentUser)return
    const db = getDatabase();
    const starCountRef = ref(db, 'users/' );
   const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentAuthUser = Object.values(data).find((findUser) =>
            findUser.uid === currentUser.uid
        );

        if (currentAuthUser) {
          setUser(currentAuthUser);
          if (currentAuthUser.profile_picture || currentAuthUser.photoURL) {
            setAvatar(currentAuthUser.profile_picture || currentAuthUser.photoURL);
          } else {
            setAvatar(defultAvatar);
          }
        }
      }
    }
    );
    return ()=> unsubscribe();
  }, [currentUser]);
  console.log(user)
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
        const db = getDatabase();
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        update(userRef, {
          photoURL: result.info.secure_url
        });
      }
    })
  }
  const location = useLocation();
  const handleSignOut =()=>{
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login");
    }).catch((error) => {
      // An error happened.
        console.log(error)
    });
  }
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
        <span onClick={handleSignOut}
          className="text-white text-5xl cursor-pointer shadow-2xl hover:scale-95 transition-all duration-100"
        >
          <MdLogout />
        </span>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
