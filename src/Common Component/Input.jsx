import propTypes from "prop-types";
import { useState } from "react";
const Input = ({ labelFor, labelValue, inputType, className }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState("");
  return (
    <div className={`relative w-1/2 ${className}`}>
      <label
        htmlFor={labelFor}
        className={`absolute top-4 left-10 text-dark-blue text-xl ${
          isFocused || isFilled ? "-translate-y-7 bg-white z-10 text-sm" : ""
        } transition-all duration-300`}
      >
        {labelValue}
      </label>
      <input
        type={inputType}
        id={labelFor}
        value={isFilled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setIsFilled(e.target.value)}
        className="px-11 py-5 border border-dark-blue border-opacity-30 rounded-lg text-dark-blue w-full"
      />
    </div>
  );
};
Input.propTypes = {
  labelFor: propTypes.string.isRequired,
  labelValue: propTypes.string.isRequired,
  inputType: propTypes.string.isRequired,
  className: propTypes.string,
};
export default Input;
