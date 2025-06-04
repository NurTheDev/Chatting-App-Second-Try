import React, {useEffect, useState} from "react";
import Section from "../Common Component/Section.jsx";
import avatar from "../assets/avatar.gif";
import {IoEllipsisVerticalSharp} from "react-icons/io5";
import {FaCamera, FaTelegramPlane} from "react-icons/fa";
import {MdEmojiEmotions} from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import Webcam from "react-webcam";
import {useSelector} from "react-redux";
import {getAuth} from "firebase/auth";
import fetchData from "../lib/helper.js";
import Skeleton from "../Common Component/Skeleton.jsx";
function ChatPage() {
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const [showWebcam, setShowWebcam] = React.useState(false);
    const [messages, setMessages] = React.useState("");
    // const [loading, setLoading] = React.useState(true);
    const {value} = useSelector((state) => state.userData);
    console.log(value)
    const auth = getAuth();
    const handleEmojiClick = (emojiObject) => {
        setMessages((prevMessages) => prevMessages + emojiObject.emoji);
    };
    const [friendlist, setFriendlist] = useState([]);
    const [myGroup, setMyGroup] = useState([]);
    const [loading, setLoading] =useState(true);
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
    return (
        <div
            className={"grid grid-cols-3 justify-center items-center gap-x-5 w-full"}
        >
            <div>
                {loading ? (<Skeleton/>):(  <Section
                    title={" Group"}
                    data={myGroup}
                    className={
                        "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                    }
                />)}
                {
                    loading ? (<Skeleton/>):( <Section
                        title={"Friends"}
                        data={friendlist}
                        className={
                            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
                        }
                    />)
                }
            </div>
            <div className={"col-span-2"}>
                <div
                    className={
                        "flex justify-between items-center mx-12  py-6 border-b border-gray-300"
                    }
                >
                    <div className={"flex justify-center gap-4"}>
                        <div>
                            <picture>
                                <img
                                    src={Object.keys(value).length > 0 ? (value?.friend?.uid !== auth.currentUser.uid ? value?.friend.img || value.avatar : value?.whomFriend?.uid !== auth.currentUser.uid ? value?.whomFriend.img || value.avatar : "") : avatar}
                                    alt="" className={"w-16 h-16 rounded-full object-cover"}/>
                            </picture>
                        </div>
                        <div>
                            <h4 className={"text-2xl font-semibold font-poppins"}>{Object.keys(value).length > 0 ? (value?.friend?.uid !== auth.currentUser.uid ? value?.friend.name : value?.whomFriend?.uid !== auth.currentUser.uid ? value?.whomFriend.name : "") : "User"} </h4>
                            <p>Online</p>
                        </div>
                    </div>
                    <span className="cursor-pointer text-xl">
            <IoEllipsisVerticalSharp/>
          </span>
                </div>
                <div
                    className={
                        "flex flex-col gap-y-4 mt-6 mx-12 h-[60vh] overflow-y-auto"
                    }
                >
                    {/* Chat messages will go here */}
                    <div className="p-4 bg-[#F1F1F1] rounded-lg shadow-md font-medium self-start">
                        <p>hi</p>
                    </div>
                    <div className="p-4 bg-primary-purple text-white rounded-lg shadow-md font-medium self-end">
                        <p>hello</p>
                    </div>
                </div>
                <div>
                    <form className="flex items-center justify-between relative p-4 border-t border-gray-300">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messages}
                            onChange={(e) => setMessages(e.target.value)}
                            className="flex-grow bg-[#f1f1f1] px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                            className={
                                "absolute flex gap-x-2 right-[10%] text-2xl text-[#707070]  "
                            }
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
                                onClick={() => setShowWebcam(!showWebcam)}
                            >
                <FaCamera/>
              </span>
                        </div>
                        <button
                            type="submit"
                            className="p-4 bg-primary-purple text-white rounded-lg ml-4 hover:bg-blue-600 transition-colors"
                        >
                            <FaTelegramPlane/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
