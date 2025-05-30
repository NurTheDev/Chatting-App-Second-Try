import React, {useContext, useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import {getAuth} from "firebase/auth";
import {blockList, groupList,} from "../lib/Data";
import fetchData from "../lib/helper.js";
import {IoMdClose} from "react-icons/io";
import {ScaleLoader} from "react-spinners";
import {getDatabase, ref, set , push} from "firebase/database";
import moment from "moment";
import {Slide, toast} from "react-toastify";
import {LoggedUserContext} from "../context/loggedUser.js";
const Home = () => {
    const LoggedUser = useContext(LoggedUserContext);
    const auth = getAuth();
    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequest, setFriendRequest] = useState([]);
    const [friendlist, setFriendlist] = useState([]);
    const [requestID, setRequestID] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [createGroup, setCreateGroup] = React.useState(false);
    const [myGroup, setMyGroup] = useState([]);
    const [inputValue, setInputValue] = useState({
        groupName: "",
        groupTitle: "",
        groupImage: null,
    });
    const [groupError, setGroupError] = useState({
        groupName: "",
        groupTitle: "",
        groupImage: "",
    })
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setInputValue((prev) => (
            {...prev, [name]: name === "groupImage" ? e.target.files[0] : value}
        ))
        setGroupError((prev) => ({
            ...prev,
            [name]: value ? "" : "This field is required",
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newError = {};
        Object.keys(inputValue).forEach(key => {
            if (!inputValue[key]) {
                newError[key] = "This field must be filled";
            } else if (key === "groupImage" && inputValue[key] && !inputValue[key].name.match(/\.(jpg|jpeg|png|gif)$/)) {
                newError[key] = "Invalid image format";
            }
        })
        setGroupError(newError);
        if (Object.keys(newError).length === 0 && inputValue.groupImage) {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("upload_preset", import.meta.env.VITE_CLOUDE_PRESET);
            formData.append("file", inputValue.groupImage);
            const cloudinaryURL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDE_NAME}/image/upload`;
            // Add your API call here to submit the form data
            try {
                const response = await fetch(cloudinaryURL, {
                    method: "POST",
                    body: formData,
                })
                const data = await response.json();
                const db = getDatabase();
                set(push(ref(db, 'myGroup/' )), {
                    groupInfo :{
                        groupName: inputValue.groupName,
                        groupTitle: inputValue.groupTitle,
                        groupImg : data.secure_url,
                    },  adminInfo:{
                        adminName: auth.currentUser.displayName || LoggedUser?.fullName,
                        adminImg: auth.currentUser.photoURL || LoggedUser?.photoURL,
                        adminId: auth.currentUser.uid || LoggedUser?.uid,
                        adminEmail: auth.currentUser.email || LoggedUser?.email,
                    },
                    createdAt: moment().toISOString(),
                }).then(()=> {
                    setUploadLoading(false);
                    setCreateGroup(false);
                    setInputValue({
                        groupName: "",
                        groupTitle: "",
                        groupImage: null,
                    })
                    toast.success('Group created successfully', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    });
                });
            } catch (error) {
                console.error("Error uploading image:", error);
                setGroupError((prev) => ({
                    ...prev,
                    groupImage: "Failed to upload image",
                }))
                setUploadLoading(false);
                setCreateGroup(true);
            } finally {
                setCreateGroup(false);
            }
        }
    }
    useEffect(() => {
        setLoading(true)
        fetchData((friendlist) => {
            const filteredFriendlist = friendlist.filter((friend) => {
                const userFriend = friend.id.includes(auth.currentUser.uid);
                return userFriend ? friend : null;
            })
            setFriendlist(filteredFriendlist);
            setLoading(false);
        }, "FriendList/");
    }, []);
    useEffect(() => {
        setLoading(true)
        fetchData((friendRequestData) => {
            const filteredRequests = friendRequestData.filter((request) => {
                return request.receiver.uid === auth.currentUser?.uid;
            })
            setFriendRequest(filteredRequests);
            setLoading(false);
        }, "FriendRequest/");
    }, []);
    useEffect(() => {
        if (friendRequest && friendRequest.length > 0) {
            const userIDs = friendRequest.map(request => request?.id);
            setRequestID(userIDs[0]);
        }
    }, [friendRequest]);
    useEffect(() => {
        setLoading(true)
        fetchData((userData) => {
            setUser(userData);
            setLoading(false);
        }, "users/");
    }, []);
    useEffect(() => {
        if (user.length && friendlist.length) {
            const friendIds = friendlist.map(friend => {
                return friend.friend?.uid === auth.currentUser.uid
                    ? friend.whomFriend?.uid
                    : friend.friend?.uid;
            });
            const filtered = user.filter(u => {
                if (u.uid === auth.currentUser.uid) return false;
                return !friendIds.includes(u.uid);
            });
            setFilteredUsers(filtered);
        } else if (user.length) {
            setFilteredUsers(user.filter(u => u.uid !== auth.currentUser.uid));
        }
    }, [user, friendlist]);
    useEffect(() => {
        setLoading(true)
        fetchData((myGroupData) => {
            const filteredMyGroup = myGroupData.filter((group) => {
                const userGroup = group.adminInfo.adminId === auth.currentUser.uid;
                return userGroup ? group : null;
            })
            setMyGroup(filteredMyGroup);
            setLoading(false);
        }, "myGroup/");
    }, []);
    return (
        <div className={"relative"}>
            {uploadLoading ? (<ScaleLoader
                color="#5f35f5"
                height={55}
                loading
                margin={5}
                radius={50}
                speedMultiplier={2}
                width={20}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            />) : (<div>
                <div className={`grid grid-cols-3 justify-center items-center gap-x-5 w-full $`}>
                    <div className="w-full">
                        <Searchbar/>
                        <Section
                            title={"Group List"}
                            data={groupList}
                            className={
                                "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[32vh]"
                            }
                        />
                    </div>
                    <Section
                        title={"Friends"}
                        data={friendlist}
                        loadingState={loading}
                        buttonData={"More"}
                        className={
                            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                        }
                    />
                    <Section
                        title={"User List"}
                        data={filteredUsers}
                        loadingState={loading}
                        IDs={requestID ? requestID : null}
                        buttonData={"+"}
                        className={
                            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                        }
                    />
                    <>
                        <Section
                            title={"Friend  Request"}
                            data={friendRequest}
                            rejectBtn={true}
                            loadingState={loading}
                            buttonData={"Accept"}
                            className={
                                "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                            }
                        />
                    </>
                    <Section
                        title={" Group"}
                        data={myGroup}
                        group={true}
                        loadingState={loading}
                        buttonData={"View"}
                        groupState={setCreateGroup}
                        className={
                            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                        }
                    />
                    <Section
                        title={"Blocked Users"}
                        data={blockList}
                        className={
                            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                        }
                    />
                </div>
                <div>
                    {createGroup && (
                        <div
                            className="fixed top-0 left-0 w-full h-full bg-black-50 bg-opacity-50 flex justify-center items-center font-poppins">
                            <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                                <div className={"flex justify-between items-center mb-4"}>
                                    <h2 className="text-xl font-semibold mb-4 ">Create Group</h2>
                                    <button onClick={() => setCreateGroup(false)}>
                                        <IoMdClose
                                            className={"text-2xl text-primary-purple hover:rotate-90 transition duration-100 hover:scale-75 cursor-pointer hover:text-red-700"}/>
                                    </button>
                                </div>

                                {/* Add your group creation form here */}
                                <form onSubmit={handleSubmit}>
                                    {groupError.groupName && (
                                        <p className="text-red-500 text-sm">{groupError.groupName}</p>
                                    )}
                                    <input
                                        name="groupName"
                                        type="text"
                                        onChange={handleInputChange}
                                        placeholder="Group Name"
                                        className="border border-gray-300 p-2 rounded w-full mb-4"
                                    />

                                    {groupError.groupTitle && (
                                        <p className="text-red-500 text-sm">{groupError.groupTitle}</p>
                                    )}
                                    <input
                                        name="groupTitle"
                                        type="text"
                                        onChange={handleInputChange}
                                        placeholder="Add a Group title"
                                        className="border border-gray-300 p-2 rounded w-full mb-4"
                                    />

                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file"
                                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round" strokeWidth="2"
                                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 "><span
                                                    className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                                                {groupError.groupImage && (
                                                    <p className="text-red-500 text-sm mt-4">{groupError.groupImage}</p>
                                                )}
                                            </div>
                                            <input onChange={handleInputChange} name="groupImage" id="dropzone-file"
                                                   type="file" className="hidden"/>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-5 font-semibold hover:bg-blue-600 transition duration-200"
                                    >
                                        Create Group
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>)}


        </div>
    );
};

export default Home;
