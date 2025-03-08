import React from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import { friendList, groupList, userList } from "../lib/Data";
const Home = () => {
  return (
    <div className="flex justify-center items-center gap-10 w-full">
      <div className="w-full">
        <Searchbar />
        <Section
          title={"Group List"}
          data={groupList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[35vh]"
          }
        />
      </div>
      <>
        <Section
          title={"Friends"}
          data={friendList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[41vh]"
          }
        />
      </>
      <>
        <Section
          title={"User List"}
          data={userList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[41vh]"
          }
        />
      </>
    </div>
  );
};

export default Home;
