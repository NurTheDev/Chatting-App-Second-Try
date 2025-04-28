import React, {useEffect, useState} from 'react';
import Searchbar from "../Common Component/Searchbar.jsx";
import fetchData from "../lib/helper.js";
import {FaEdit, FaKey, FaTrashAlt} from "react-icons/fa";
import {RiMessage3Fill} from "react-icons/ri";
import {TbPhotoPlus} from "react-icons/tb";
import {IoMdHelpCircleOutline} from "react-icons/io";
import {VscColorMode} from "react-icons/vsc";

function Settings() {
    const settingsItems = [
        {id: 1, title: "Edit Profile Name", icon: <FaEdit/>},
        {id: 2, title: "Edit Profile Status Info", icon: <RiMessage3Fill/>},
        {id: 3, title: "Edit Profile Photo", icon: <TbPhotoPlus/>},
        {id: 4, title: "Help", icon: <IoMdHelpCircleOutline/>}
    ]
    const accountSetting = [
        {id: 1, title: "Change Password", icon: <FaKey/>},
        {id: 2, title: "Theme.", icon: <VscColorMode/>},
        {id: 3, title: "Delete Account.", icon: <FaTrashAlt/>},
    ]
    // const auth = getAuth();
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        fetchData((userData) => {
            setCurrentUser(userData);
        }, "users/", "owner");
    }, []);

    return (
        <div>
            <Searchbar/>
            <div className={`grid grid-cols-2 mt-10 gap-x-7`}>
                <div className={"py-5 px-7 rounded-[20px] shadow-md"}>
                    <h3
                        className={"text-xl font-semibold font-poppins"}>Profile Settings</h3>
                    <div className={"flex items-center gap-x-8 mt-7 py-7 border-b-2 border-gray-300"}>
                        <div>
                            <picture>
                                <img className={"rounded-full w-24 h-24 "} src={currentUser[0]?.photoURL}
                                     alt={currentUser[0]?.photoURL}/>
                            </picture>
                        </div>
                        <div>
                            <h1 className={"text-2xl font-semibold font-poppins"}>{currentUser[0]?.fullName}</h1>
                            <p className={"text-xl font-poppins mt-1"}>{currentUser[0]?.bio ? (currentUser[0].bio) : "Set a Bio"}</p>
                        </div>
                    </div>
                    <ul className={"mt-10"}>
                        {settingsItems?.map((item) => (
                            <li key={item.id}
                                className={"flex items-center gap-x-4 py-5 hover:scale-95 transition-all duration-100 cursor-pointer hover:text-primary-purple"}>
                                <span className={"text-2xl text-gray-500"}>
                                    {item.icon}
                                </span>
                                <h3 className={"text-xl font-poppins"}>{item.title}</h3>
                            </li>
                        ))}

                    </ul>
                </div>
                <div className={" py-5 px-7 rounded-[20px] shadow-md"}>
                    <h3
                        className={"text-xl font-semibold font-poppins"}>Account Settings</h3>
                    <ul className={"mt-10"}>
                        {accountSetting?.map((item) => (
                            <li key={item.id}
                                className={"flex items-center gap-x-4 py-5 hover:scale-95 transition-all duration-100 cursor-pointer hover:text-primary-purple"}>
                                <span className={"text-2xl text-gray-500"}>
                                    {item.icon}
                                </span>
                                <h3 className={"text-xl font-poppins"}>{item.title}</h3>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Settings;