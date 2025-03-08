import PropTypes from "prop-types";
import React from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import User from "./User";

const Section = ({ data, className, title }) => {
  return (
    <div className=" mt-8 px-5 rounded-[20px] bg-white shadow-lg w-full">
      <div className="flexRowBetween">
        <h2 className="text-xl font-semibold font-poppins">{title}</h2>{" "}
        <span className="cursor-pointer text-xl">
          <IoEllipsisVerticalSharp />
        </span>
      </div>
      <div className={` mt-4 ${className}`}>
        {data.map((item, index) => (
          <User
            key={item.id}
            img={item.avatar}
            name={item.name}
            message={item.message}
            time={item.time}
            button={item.button && item.button}
            className={
              index === data.length - 1
                ? "border-b-0"
                : "border-b border-b-gray-medium-35"
            }
          />
        ))}
        {/* <User name={data} /> */}
      </div>
    </div>
  );
};

Section.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Section;
