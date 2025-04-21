import React, {useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import { getAuth } from "firebase/auth";
import {
  blockList,
  friendList,
  friendRequest,
  groupList,
  // userList,
} from "../lib/Data";
import fetchData from "../lib/helper.js";
const Home = () => {
    const auth = getAuth();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
const [friendRequest, setFriendRequest] = useState([]);
    useEffect(() => {
        setLoading(true)
        fetchData((userData)=>{
            setUser(userData);
            setLoading(false);
        }, "users/");
    }, []);
    useEffect(() => {
        setLoading(true)
        fetchData((friendRequestData)=>{
            const filteredRequests = friendRequestData.filter((request)=>{
                return request.receiver.uid === auth.currentUser?.uid;
            })
            setFriendRequest(filteredRequests);
            console.log(friendRequestData)
            setLoading(false);
        }, "FriendRequest/");
    }, []);
  return (
    <div className="grid grid-cols-3 justify-center items-center gap-x-5 w-full">
      <div className="w-full">
        <Searchbar />
        <Section
          title={"Group List"}
          data={user}
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
          loadingState={loading}
          buttonData={"+"}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={"Friend  Request"}
          data={friendRequest}
            loadingState={loading}
          buttonData={"Accept"}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={" Group"}
          data={user}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
      <>
        <Section
          title={"Blocked Users"}
          data={user}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[38vh]"
          }
        />
      </>
    </div>
  );
};

export default Home;
