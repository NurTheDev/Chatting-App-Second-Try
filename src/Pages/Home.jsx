import React, {useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import {
  blockList,
  friendList,
  friendRequest,
  groupList,
  // userList,
} from "../lib/Data";
import fetchData from "../lib/helper.js";
const Home = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        fetchData((userData)=>{
            setUser(userData);
            setLoading(false);
        });
    }, []);
    console.log(user)
  return (
    <div className="grid grid-cols-3 justify-center items-center gap-x-5 w-full">
      <div className="w-full">
        <Searchbar />
        <Section
          title={"Group List"}
          data={groupList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[32vh]"
          }
        />
      </div>
      <>
        <Section
          title={"Friends"}
          data={user}
          loadingState={loading}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={"User List"}
          data={user}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={"Friend  Request"}
          data={friendRequest}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={" Group"}
          data={friendList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={"Blocked Users"}
          data={blockList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
    </div>
  );
};

export default Home;
