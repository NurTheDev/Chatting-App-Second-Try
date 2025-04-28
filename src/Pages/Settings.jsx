import React, {useEffect, useState} from 'react';
import Searchbar from "../Common Component/Searchbar.jsx";
import fetchData from "../lib/helper.js";
import {FaEdit, FaKey, FaTrashAlt} from "react-icons/fa";
import {RiMessage3Fill} from "react-icons/ri";
import {TbPhotoPlus} from "react-icons/tb";
import {IoMdHelpCircleOutline} from "react-icons/io";
import {VscColorMode} from "react-icons/vsc";
import {getAuth, updateProfile} from "firebase/auth";
import {toast} from "react-toastify";
import {getDatabase, ref, update} from "firebase/database";
import UnderConstruction from "../Common Component/UnderConstruction.jsx";

function Settings() {
    const settingsItems = [
        {id: "editName", title: "Edit Profile Name", icon: <FaEdit/>},
        {id: "editBio", title: "Edit Profile Status Info", icon: <RiMessage3Fill/>},
        {id: "editProfile", title: "Edit Profile Photo", icon: <TbPhotoPlus/>},
        {id: "help", title: "Help", icon: <IoMdHelpCircleOutline/>}
    ]
    const accountSetting = [
        {id: "changePassword", title: "Change Password", icon: <FaKey/>},
        {id: 2, title: "Theme.", icon: <VscColorMode/>},
        {id: 3, title: "Delete Account.", icon: <FaTrashAlt/>},
    ]
    // const auth = getAuth();
    const [settings, setSettings] = useState("");
    const [name, setName] = useState({
        firstName: "",
        lastName: "",
    });
    const [bio, setBio] = useState("")
    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        bio: "",
    })
    const auth = getAuth();
    const db = getDatabase();
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        fetchData((userData) => {
            setCurrentUser(userData);
        }, "users/", "owner");
    }, []);
    useEffect(() => {
        if (currentUser[0]?.fullName) {
            const nameParts = currentUser[0].fullName.split(" ");
            setName({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join("") || ""
            })
        }
        if (currentUser[0]?.bio) {
            setBio(currentUser[0].bio);
        }
    }, [currentUser]);
    const handleSettings = (e) => {
        if (e.id === "editName") {
            setSettings("editName");
        } else if (e.id === "editBio") {
            setSettings("editBio");
        } else if (e.id === "editProfile") {
            setSettings("editProfile");
        } else if (e.id === "changePassword") {
            setSettings("changePassword");
        }
    }
    const handleInputChange = (e) => {
        const {id, value} = e.target;
        if (id === "firstName" || id === "lastName") {
            setName((prevState) => (
                {
                    ...prevState,
                    [id]: value,
                }
            ))
        }
        if (value === "") {
            setError((prevState) => ({
                ...prevState,
                [id]: `${id === "firstName" ? "First" : "Last"} name must be filled`,
            }))
        } else {
            setError((prevState) => ({
                ...prevState,
                [id]: "",
            }))
        }
        if (id === "bio") {
            setBio(value);
            if (value === "") {
                setError((prevState) => ({
                    ...prevState,
                    bio: "Bio cannot be empty",
                }))
            } else if (value.length > 100) {
                setError(prev => ({...prev, bio: "Bio must be less than 101 characters"}));
            } else {
                setError((prevState) => ({
                    ...prevState,
                    bio: "",
                }))
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const {firstName, lastName} = name;
        if (error.firstName || error.lastName || error.bio) {
            toast.error("Please fix the errors before submitting", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        if (firstName && lastName) {
            updateProfile(auth.currentUser, {
                displayName: `${firstName} ${lastName}`,
            }).then(() => {
                update(ref(db, "users/" + auth.currentUser.uid), {
                    fullName: `${firstName} ${lastName}`,
                }).then((response) => {
                    console.log("Profile updated successfully", response);
                    setSettings("");
                    toast.success("Profile updated successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
            }).catch((err) => {
                console.log("Error updating profile", err);
                toast.error("Error updating profile", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });

        }
        if (bio && !error.bio) {
            update(ref(db, "users/" + auth.currentUser.uid), {
                bio: bio,
            }).then((response) => {
                console.log("Bio updated successfully", response);
                setSettings("");
                toast.success("Bio updated successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }).catch((error) => {
                console.log("Error updating bio", error);
                toast.error("Error updating bio", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        }
    }

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
                                onClick={() => handleSettings(item)}
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
                    {!settings ? (<ul className={"mt-10"}>
                        {accountSetting?.map((item) => (
                            <li key={item.id}
                                onClick={() => handleSettings(item)}
                                className={"flex items-center gap-x-4 py-5 hover:scale-95 transition-all duration-100 cursor-pointer hover:text-primary-purple"}>
                                <span className={"text-2xl text-gray-500"}>
                                    {item.icon}
                                </span>
                                <h3 className={"text-xl font-poppins"}>{item.title}</h3>
                            </li>
                        ))}

                    </ul>) : settings === "editName" ? (<div>
                        <form className="max-w-sm mx-auto mt-10 font-poppins" onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="firstName"
                                       className="block mb-2 text-lg font-semibold text-gray-900 ">First name</label>
                                <input type="text" id="firstName"
                                       onChange={handleInputChange}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="Enter your first name" required/>
                                {error.firstName && <p className="text-red-500 text-sm">{error.firstName}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="lastName"
                                       className="block mb-2 text-lg font-semibold text-gray-900">Last name</label>
                                <input type="text" id="lastName"
                                       onChange={handleInputChange}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="Enter your last name" required/>
                                {error.lastName && <p className="text-red-500 text-sm">{error.lastName}</p>}
                            </div>

                            <button type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit
                            </button>
                        </form>
                    </div>) : settings === "editBio" ? (
                        <form className="max-w-sm mx-auto mt-10 font-poppins" onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="bio"
                                       className="block mb-2 text-lg font-semibold text-gray-900 ">Set your Bio</label>
                                <input type="text" id="bio" onChange={handleInputChange}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                       placeholder="Max charecter 101   " required/>
                                {error.bio && <p className="text-red-500 text-sm">{error.bio}</p>}
                            </div>
                            <button type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit
                            </button>
                        </form>) : settings === "editProfile" ? (<UnderConstruction/>) : ""}

                </div>
            </div>
        </div>
    );
}

export default Settings;