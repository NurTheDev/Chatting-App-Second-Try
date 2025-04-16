import React, {useEffect, useState} from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import {
  blockList,
  friendList,
  friendRequest,
  groupList,
  userList,
} from "../lib/Data";
import { getDatabase, ref, onValue } from "firebase/database";
const Home = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
        useEffect(() => {
        const db = getDatabase();
        setLoading(true)
        const starCountRef = ref(db, 'users/' );
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setUser(Object.values(data));
            setLoading(false);
        });
    }, []);
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
          data={userList}
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
