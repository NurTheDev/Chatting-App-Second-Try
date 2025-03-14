import React from 'react';
import {friendList} from "../lib/Data.js";
import Section from "../Common Component/Section.jsx";

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

            </div>
        </div>
    );
}

export default ChatPage;