import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import registrationImg from "../assets/registrationBanner.png";
import Button from "../Common Component/Button";
import Input from "../Common Component/Input";
import inputData, { useTogglePasswordVisibility } from "../lib/inputData";

const Register = () => {
  const auth = getAuth();
  const { showPassword, toggleShowPassword } = useTogglePasswordVisibility();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key]) {
        newErrors[key] = "This field must be filled";
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(userCredential, user);
          updateProfile(user, {
            displayName: formValues.name,
          });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);

          if (errorCode.includes("password")) {
            setErrors({
              password: errorMessage,
            });
          }
          if (errorCode.includes("email")) {
            setErrors({
              email: errorMessage,
            });
          }
          // ..
        });
    }
  };

  return (
    <div>
      <div className="container">
        <div className="flexRowBetween h-screen">
          <div className="flex flex-col space-y-14 justify-center h-screen w-1/2 px-40">
            <div>
              <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
                Get started with easily register
              </h1>
              <p className="font-nunito font-normal text-xl text-black-50 mt-4">
                Free register and you can enjoy it
              </p>
            </div>
            <form className="w-full" onSubmit={handleSubmit}>
              {inputData.map((data) => (
                <div key={data.id}>
                  <Input
                    labelFor={data.labelFor}
                    labelValue={data.labelValue}
                    inputType={
                      data.inputType === "password" && showPassword
                        ? "text"
                        : data.inputType
                    }
                    className="px-11 py-5 border border-dark-blue border-opacity-30 rounded-lg text-dark-blue w-full"
                    value={formValues[data.labelFor]}
                    onChange={handleInputChange}
                    errorMessage={errors[data.labelFor]}
                  >
                    {data.inputType === "password" &&
                      (showPassword ? (
                        <IoMdEyeOff onClick={toggleShowPassword} />
                      ) : (
                        <IoMdEye onClick={toggleShowPassword} />
                      ))}
                  </Input>
                </div>
              ))}
              <Button
                btnContent={"Sign up"}
                className={"w-full rounded-[86px]"}
              />
            </form>
            <p className="text-sm text-dark-blue font-openSans text-center">
              Already have an account ?{" "}
              <span className="text-[#EA6C00] font-bold cursor-pointer hover:text-primary-purple transition-all duration-100">
                <Link to="/login">Sign In</Link>
              </span>
            </p>
          </div>
          <div className="h-full overflow-hidden">
            <picture>
              <img src={registrationImg} alt="" className="object-cover" />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
