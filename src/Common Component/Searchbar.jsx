import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
const Searchbar = () => {
  return (
    <div className="relative cursor-pointer">
      <span className="absolute top-1/2 left-7 transform -translate-y-1/2 text-gray-medium">
        <FaMagnifyingGlass />
      </span>
      <input
        type="text"
        placeholder="Search"
        className="pr-6 pl-16 py-5 bg-white rounded-[20px] w-full shadow-lg text-gray-medium font-medium focus:outline-0 font-poppins"
      />
      <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-gray-medium">
        <IoEllipsisVerticalSharp />
      </span>
    </div>
  );
};

export default Searchbar;
