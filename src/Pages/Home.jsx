import React from "react";
import Searchbar from "../Common Component/Searchbar";
import Section from "../Common Component/Section";
import { groupList } from "../lib/Data";
const Home = () => {
  return (
    <div className="">
      <div>
        <Searchbar />
        <Section
          title={"Group List"}
          data={groupList}
          className={
            "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-[35vh]"
          }
        />
      </div>
    </div>
  );
};

export default Home;
