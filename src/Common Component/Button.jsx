import React from "react";
import propTypes from "prop-types";
const Button = ({ btnContent, className }) => {
  return (
    <>
      <button
        className={`bg-primary-purple py-5 text-white font-nunito font-semibold text-xl cursor-pointer hover:bg-dark-blue transition-all duration-200 hover:scale-95 ${className}`}
      >
        {btnContent}
      </button>
    </>
  );
};
Button.propTypes = {
  btnContent: propTypes.string.isRequired,
  className: propTypes.string,
};
export default Button;
