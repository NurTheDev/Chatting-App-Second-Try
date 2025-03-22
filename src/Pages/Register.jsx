import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Flip, toast } from "react-toastify";
import registrationImg from "../assets/registrationBanner.png";
import Button from "../Common Component/Button";
import Input from "../Common Component/Input";
import inputData, { useTogglePasswordVisibility } from "../lib/inputData";
const Register = () => {
  const auth = getAuth();
  const { showPassword, toggleShowPassword } = useTogglePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const successLogin = () => {
    navigate("/confirm-email");
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
      setLoading(true);
      // Submit the form
      createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        return  updateProfile(user, {
            displayName: formValues.name,
          });
          // ...
        })
        .then(() => {
          toast.success(
            `${formValues.name} your account created successfully`,
            {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Flip,
            }
          );

         return  sendEmailVerification(auth.currentUser);
        })
        .then(() => {
          const db = getDatabase();
          const userId = auth.currentUser.uid;
          const email = auth.currentUser.email;
          set(ref(db, "users/" + userId), {
            fullName: auth.currentUser.displayName,
            email: email,
            photoURL: "",
            uid: userId
          });
        }).then(()=>{
        successLogin();
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);

          if (errorCode.includes("password")) {
            setErrors((prev) => ({
              ...prev,
              password: errorMessage,
            }));
          } else if (errorCode.includes("email")) {
            setErrors((prev) => ({
              ...prev,
              email: errorMessage,
            }));
          }
          // ..
        })
        .finally(() => {
          setLoading(false);
          setFormValues({
            name: "",
            email: "",
            password: "",
          });
        });
    }
  };

  return (
    <>
      {/* <!-- Register Section --> */}
      {loading && (
        <ScaleLoader
          color="#5f35f5"
          height={55}
          loading
          margin={5}
          radius={50}
          speedMultiplier={2}
          width={20}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        />
      )}
      <div className={` ${loading ? "opacity-30" : "opacity-100"}`}>
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
                      inputValue={formValues[data.labelFor]}
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
    </>
  );
};

export default Register;
