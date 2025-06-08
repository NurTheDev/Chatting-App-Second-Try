import React, {useContext, useEffect, useState} from "react";
import Section from "../Common Component/Section.jsx";
import avatar from "../assets/avatar.gif";
import {IoEllipsisVerticalSharp} from "react-icons/io5";
import {FaCamera, FaTelegramPlane} from "react-icons/fa";
import {MdEmojiEmotions} from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import {useSelector} from "react-redux";
import {getAuth} from "firebase/auth";
import fetchData from "../lib/helper.js";
import Skeleton from "../Common Component/Skeleton.jsx";
import moment from "moment";
import {getDatabase,ref, set} from "firebase/database";
import {LoggedUserContext} from "../context/loggedUser.js";
import {IoMdClose} from "react-icons/io";
function ChatPage() {
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const [imageModal, setImageModal] = React.useState(false);
    const [sendImageLoading, setSendImageLoading] =useState(false);
    const [messages, setMessages] = React.useState({
        text: "",
        image: [],
        video: null,
        audio: null,
        file: null,
        id: "",
        time: moment().toISOString(),
        senderInfo: {
            uid: "",
            name: "",
            img: ""
        },
        receiverInfo: {
            uid: "",
            name: "",
            img: ""
        }
    });
    const [messageList, setMessageList] = React.useState([]);
    const {value} = useSelector((state) => state.userData);
    const auth = getAuth();
    const handleEmojiClick = (emojiObject) => {
        setMessages((prevMessages) => {
            return {
                ...prevMessages,
                text: prevMessages.text + emojiObject.emoji
            };
        });
    };
    const LoggedUser = useContext(LoggedUserContext);
    const [friendlist, setFriendlist] = useState([]);
    const [myGroup, setMyGroup] = useState([]);
    const [loading, setLoading] = useState(false);
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
        fetchData((myGroupData) => {
            const filteredMyGroup = myGroupData.filter((group) => {
                const userGroup = group.adminInfo.adminId === auth.currentUser.uid;
                return userGroup ? group : null;
            })
            setMyGroup(filteredMyGroup);
            setLoading(false);
        }, "myGroup/");
    }, []);

    useEffect(() => {
        // Don't proceed if auth.currentUser is not available
        if (!auth.currentUser) return;

        fetchData((messages) => {
            if (!messages || messages.length === 0) {
                setMessageList([]);
                return;
            }
            try {
                const otherUserId = value?.friend?.uid !== auth.currentUser.uid
                    ? value?.friend?.uid
                    : value?.whomFriend?.uid;
                const filteredMessages = Object.values(messages).filter((message) => {
                    return message.id.includes(auth.currentUser.uid) &&
                        message.id.includes(otherUserId);
                });
                const sortedMessages = filteredMessages.sort((a, b) =>
                    new Date(a.time) - new Date(b.time)
                );
                setMessageList(sortedMessages);
            } catch (error) {
                console.error("Error filtering messages:", error);
                setMessageList([]);
            }
        }, "messages/");
    }, [value, auth.currentUser?.uid]);
    const handleSendMessage=(e)=>{
        e.preventDefault()
        if (messages.text.trim() === "") {
             // Prevent sending empty messages
            return
        }
        const receiverInfo = {
            uid: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.uid : value?.whomFriend?.uid || "",
            name: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.name : value?.whomFriend?.name || "User",
            img: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.img : value?.whomFriend?.img || avatar
        }
        const newMessage ={
            ...messages,
            id: `${auth.currentUser.uid}-${receiverInfo.uid}-${Date.now()}`,
            senderInfo: {
                uid: auth.currentUser.uid,
                name: LoggedUser.fullName || "Anonymous",
                img: LoggedUser.photoURL || avatar
            },
            receiverInfo: receiverInfo,
        }
        // Here you would typically send the message to your backend or database
        const db = getDatabase();
        const messagesRef = ref(db, `messages/` + newMessage.id);
        set(messagesRef, newMessage)
            .then(() => {
                console.log("Message sent successfully", newMessage);
                setMessages({
                    text: "",
                    image: [],
                    video: null,
                    audio: null,
                    file: null,
                    id: "",
                    time: moment().toISOString(),
                    senderInfo: {
                        uid: auth.currentUser.uid,
                        name: auth.currentUser.displayName || "Anonymous",
                        img: auth.currentUser.photoURL || avatar
                    },
                    receiverInfo: receiverInfo
                });
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
    }
    const handleUploadImage = async (e) => {
        const files = e.target.files;
        if(!files || files.length === 0) return;
        let UploadedImages = [];
        for(const file of files) {
            setSendImageLoading(true);
            const formData = new FormData();
            formData.append("upload_preset", import.meta.env.VITE_CLOUDE_PRESET);
            formData.append("file", file);
            const cloudinaryURL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDE_NAME}/image/upload`;
            try {
                const response = await fetch(cloudinaryURL, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                if (data.secure_url){
                    UploadedImages.push(data.secure_url);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        }
        if (UploadedImages.length > 0) {
            setMessages((prevMessages) => ({
                ...prevMessages,
                image: [...prevMessages.image, ...UploadedImages],
                text: "",
                time: moment().toISOString(),
                senderInfo: {
                    uid: auth.currentUser.uid,
                    name: LoggedUser.fullName || "Anonymous",
                    img: LoggedUser.photoURL || avatar
                },
                receiverInfo: {
                    uid: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.uid : value?.whomFriend?.uid || "",
                    name: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.name : value?.whomFriend?.name || "User",
                    img: auth.currentUser.uid !== value?.friend?.uid ? value?.friend?.img : value?.whomFriend?.img || avatar
                },
                id: `${auth.currentUser.uid}-${value?.friend?.uid}-${Date.now()}`,
            }));
        }
        setImageModal(false);
        setSendImageLoading(false);
    }
    console.log("messageList:", messages.image);
    return (
        <>{sendImageLoading ?
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div> : (<div
                className={"grid grid-cols-3 justify-center items-center gap-x-5 w-full relative"}
            >
                {imageModal && (

                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black-50 bg-opacity-50 flex justify-center items-center font-poppins">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                            <div className={"flex justify-between items-center mb-4"}>
                                <h2 className="text-xl font-semibold mb-4 ">Create Group</h2>
                                <button onClick={() =>setImageModal(false)}>
                                    <IoMdClose
                                        className={"text-2xl text-primary-purple hover:rotate-90 transition duration-100 hover:scale-75 cursor-pointer hover:text-red-700"}/>
                                </button>
                            </div>

                            {/* Add your group creation form here */}
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

                                    </div>
                                    <input
                                        multiple onChange={(e)=> handleUploadImage(e)}
                                        name="groupImage" id="dropzone-file"
                                        type="file" className="hidden"/>
                                </label>
                            </div>
                        </div>
                    </div>

                )}
                <div>
                    {loading ? (<Skeleton/>) : (<Section
                        title={" Group"}
                        data={myGroup}
                        className={"overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"}
                    />)}
                    {loading ? (<Skeleton/>) : (<Section
                        title={"Friends"}
                        data={friendlist}
                        className={"overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"}
                    />)}
                </div>
                <div className={"col-span-2"}>
                    <div
                        className={"flex justify-between items-center mx-12  py-6 border-b border-gray-300"}
                    >
                        <div className={"flex justify-center gap-4"}>
                            <div>
                                <picture>
                                    <img
                                        src={Object.keys(value).length > 0 ? (value?.friend?.uid !== auth.currentUser?.uid ? value?.friend.img || value.avatar : value?.whomFriend?.uid !== auth.currentUser?.uid ? value?.whomFriend.img || value.avatar : "") : avatar}
                                        alt="" className={"w-16 h-16 rounded-full object-cover"}/>
                                </picture>
                            </div>
                            <div>
                                <h4 className={"text-2xl font-semibold font-poppins"}>{Object.keys(value).length > 0 ? (value?.friend?.uid !== auth.currentUser?.uid ? value?.friend.name : value?.whomFriend?.uid !== auth.currentUser?.uid ? value?.whomFriend.name : "") : "User"} </h4>
                                <p>{navigator.onLine ? "Online" : "Offline"}</p>
                            </div>
                        </div>
                        <span className="cursor-pointer text-xl">
            <IoEllipsisVerticalSharp/>
          </span>
                    </div>
                    {/*Message section start from here*/}
                    {
                        messageList.length > 0 ?(
                            <div
                                className={"flex flex-col gap-y-4 mt-6 mx-12 h-[60vh] overflow-y-auto"}
                            >

                                {messageList.map((message, index) => (
                                    <div key={index} className={`flex ${message.senderInfo.uid === auth.currentUser.uid ? "justify-end" : "justify-start"} items-start gap-x-4`}>
                                        {message.senderInfo.uid !== auth.currentUser.uid && (
                                            <img src={message.senderInfo.img || avatar} alt="Sender Avatar" className="w-8 h-8 rounded-full object-cover"/>
                                        )}
                                        <div className={`flex flex-col max-w-[70%] ${message.senderInfo.uid === auth.currentUser.uid ? "items-end" : "items-start"}`}>
                                            <div className={`p-3 rounded-lg ${message.senderInfo.uid === auth.currentUser.uid ? "bg-primary-purple text-white" : "bg-gray-200 text-gray-800"}`}>
                                                <p>{message.text}</p>
                                            </div>
                                            <span className={`text-xs text-gray-500 mt-1`}>{moment(message.time).fromNow()}</span>
                                        </div>
                                        {message.senderInfo.uid === auth.currentUser.uid && (
                                            <img src={message.senderInfo.img || avatar} alt="Sender Avatar" className="w-8 h-8 rounded-full object-cover"/>
                                        )}
                                    </div>
                                ))}

                            </div>
                        ):( <div className="flex flex-col items-center justify-center h-[60vh] mx-12">
                            <div className="relative w-48 h-48 mb-6">
                                <div className="absolute inset-0 bg-primary-purple/10 rounded-full animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <svg className="w-24 h-24 text-primary-purple/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M15 5.5C14.44 4.4 13.31 3.31 11.5 3.31C8.89 3.31 7 6 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M20.0001 7.31006C20.0001 7.31006 19.3901 8.68006 17.7001 8.68006" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No messages yet</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Start a conversation with {value?.friend?.name || value?.whomFriend?.name || "your friend"}. Say hello!
                            </p>
                            <button
                                onClick={() => setMessages(prev => ({...prev, text: "Hello! How are you?"}))}
                                className="mt-6 px-6 py-3 bg-primary-purple text-white rounded-full hover:bg-primary-purple/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary-purple/20 transform hover:-translate-y-1"
                            >
                                <span>Start chatting</span>
                                <FaTelegramPlane />
                            </button>
                        </div>)
                    }
                    <div>
                        <form className="flex items-center justify-between relative p-4 border-t border-gray-300">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messages.text}
                                onChange={(e) => setMessages((prev)=> ({...prev, text: e.target.value}))}
                                className="flex-grow bg-[#f1f1f1] px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div
                                className={"absolute flex gap-x-2 right-[10%] text-2xl text-[#707070]  "}
                            >
              <span
                  className={"cursor-pointer"}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <MdEmojiEmotions/>
              </span>{" "}
                                <span
                                    className={`absolute right-2 bottom-10 transition-all duration-200 ease-in-out transform ${showEmojiPicker ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                                >
                <EmojiPicker onEmojiClick={handleEmojiClick}/>
              </span>
                                <span
                                    className={"cursor-pointer"}
                                    onClick={()=>setImageModal(!imageModal) }
                                >
                <FaCamera/>
              </span>
                            </div>
                            <button
                                type="submit"
                                onClick={handleSendMessage}
                                className="p-4 bg-primary-purple text-white rounded-lg ml-4 hover:bg-blue-600 transition-colors"
                            >
                                <FaTelegramPlane/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>)}</>
    );
}

export default ChatPage;
