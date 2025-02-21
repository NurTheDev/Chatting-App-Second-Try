import propTypes from "prop-types";
import { useState } from "react";
const Input = ({
  labelFor,
  labelValue,
  inputType,
  className,
  children,
  // inputValue
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleInput = (e) => {
    setIsFilled(e.target.value);
    if (labelFor === "name") {
      setName(e.target.value);
    } else if (labelFor === "email") {
      setEmail(e.target.value);
    } else if (labelFor === "password") {
      setPassword(e.target.value);
    }
  };
  console.log(name, email, password);

  return (
    <div className={`relative mb-10`}>
      <label
        htmlFor={labelFor}
        className={`absolute top-4 left-10 text-dark-blue ${
          isFocused || isFilled
            ? "-translate-y-6 bg-white z-10 text-sm"
            : "text-xl "
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
        onChange={handleInput}
        className={className}
      />
      {children && (
        <div className="absolute top-5 right-5 text-2xl cursor-pointer">
          {children}
        </div>
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
};
export default Input;
