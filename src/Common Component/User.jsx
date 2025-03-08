import PropTypes from "prop-types";
import React from "react";

const User = ({ img, name, message, button, time, className }) => {
  return (
    <div
      className={`flex justify-between mx-5 items-center gap-4 font-poppins py-4  ${className}`}
    >
      <div className="flex gap-4 items-center">
        <div>
          <img src={img} alt={img} className="rounded-full w-[70px] h-[70px]" />
        </div>
        <div className="flex flex-col ">
          <h3 className="text-lg font-semibold ">{name}</h3>
          <p className="text-sm text-gray-dark">{message}</p>
        </div>
      </div>
      {time ? (
        <p className="text-sm text-gray-dark">{time}</p>
      ) : (
        <button className="text-white p-2 bg-primary-purple text-xl font-semibold rounded-md min-w-12 ">
          {button}
        </button>
      )}
    </div>
  );
};
User.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  time: PropTypes.string,
  className: PropTypes.string,
};
export default User;
