import React from "react";
import { friendList } from "../lib/Data.js";
import Section from "../Common Component/Section.jsx";
import avatar from "../assets/avatar.gif";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaCamera, FaTelegramPlane } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import Webcam from "react-webcam";

function ChatPage() {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showWebcam, setShowWebcam] = React.useState(false);
  const [messages, setMessages] = React.useState("");
  // const [loading, setLoading] = React.useState(true);

  return (
    <div
      className={"grid grid-cols-3 justify-center items-center gap-x-5 w-full"}
    >
      <div>
        <Section
          title={" Group"}
          data={friendList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
        <Section
          title={"Friends"}
          data={friendList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
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
                <img src={avatar} alt="" />
              </picture>
            </div>
            <div>
              <h4 className={"text-2xl font-semibold font-poppins"}>Swathi </h4>
              <p>Online</p>
            </div>
          </div>
          <span className="cursor-pointer text-xl">
            <IoEllipsisVerticalSharp />
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
                <MdEmojiEmotions />
              </span>{" "}
              <span
                className={`absolute right-2 bottom-10 transition-all duration-200 ease-in-out transform ${showEmojiPicker ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <EmojiPicker />
              </span>
              <span
                className={"cursor-pointer"}
                onClick={() => setShowWebcam(!showWebcam)}
              >
                <FaCamera />
              </span>
              {showWebcam && (
                <div className="absolute bottom-[100%] right-0 shadow-lg">
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="rounded-md w-64 h-48"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="p-4 bg-primary-purple text-white rounded-lg ml-4 hover:bg-blue-600 transition-colors"
            >
              <FaTelegramPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
