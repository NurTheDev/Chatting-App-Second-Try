import React from 'react';
import {friendList} from "../lib/Data.js";
import Section from "../Common Component/Section.jsx";
import avatar from "../assets/avatar.gif"
import {IoEllipsisVerticalSharp} from "react-icons/io5";
function ChatPage() {
    return (
        <div className={"grid grid-cols-3 justify-center items-center gap-x-5 w-full"}>
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
                <div className={"flex justify-between items-center mx-12  py-6 border-b border-gray-300"}>
                    <div className={"flex justify-center gap-4"}>
                        <div><picture><img src={avatar} alt=""/></picture></div><div><h4 className={"text-2xl font-semibold font-poppins"}>Swathi </h4><p>Online</p></div>
                    </div>
                    <span className="cursor-pointer text-xl">
          <IoEllipsisVerticalSharp /></span>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;