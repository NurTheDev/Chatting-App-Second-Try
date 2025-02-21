import { useState } from "react";
const inputData = [
  {
    id: 1,
    labelFor: "name",
    labelValue: "Full name",
    inputType: "text",
  },
  {
    id: 2,
    labelFor: "email",
    labelValue: "Email Address",
    inputType: "email",
  },
  {
    id: 3,
    labelFor: "password",
    labelValue: "Password",
    inputType: "password",
  },
];

export default inputData;
export const useTogglePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return { showPassword, toggleShowPassword };
};
