import React from "react";
import propTypes from "prop-types";
import { useState } from "react";
const Input = ({
  labelFor,
  labelValue,
  inputType,
  className,
  children,
  inputValue,
  onChange,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`relative mb-10`}>
      <label
        htmlFor={labelFor}
        className={`absolute top-4 left-10 text-dark-blue ${
          isFocused || inputValue
            ? "-translate-y-6 bg-white z-10 text-sm"
            : "text-xl "
        } transition-all duration-300`}
      >
        {labelValue}
      </label>
      <input
        type={inputType}
        id={labelFor}
        value={inputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!e.target.value) setIsFocused(false);
        }}
        onChange={onChange}
        className={className}
      />
      {children && (
        <div className="absolute top-5 right-5 text-2xl cursor-pointer">
          {children}
        </div>
      )}
      {errorMessage && (
        <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
};
Input.propTypes = {
  labelFor: propTypes.string.isRequired,
  labelValue: propTypes.string.isRequired,
  inputType: propTypes.string.isRequired,
  className: propTypes.string,
  children: propTypes.node,
  inputValue: propTypes.string,
  onChange: propTypes.func,
  errorMessage: propTypes.string,
};
export default Input;
