import React from "react";
// import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Flip, toast } from "react-toastify";
import Button from "../Common Component/Button";
import Input from "../Common Component/Input";
import loginBanner from "../assets/LoginBanner.png";
import inputData, { useTogglePasswordVisibility } from "../lib/inputData";
const Login = () => {
  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth();

  const { showPassword, toggleShowPassword } = useTogglePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token);
        const db = getDatabase();
        set(ref(db, "users" + user.uid), {
          username: user.displayName,
          email: user.email,
          profile_picture: user.photoURL,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  };
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
    const newError = {};
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key]) {
        newError[key] = "This field must be filled";
      } else if (
        key === "email" &&
        !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formValues[key])
      ) {
        newError[key] = "Invalid email address";
      }
    });

    setErrors(newError);
    if (Object.keys(newError).length === 0) {
      setLoading(true);
      const { email, password } = formValues;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          // ...
          setLoading(false);
          return user;
        })
        .then((user) => {
          toast.success(`${user.displayName} welcome to your account`, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Flip,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setLoading(false);
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
      <div className={`container ${loading ? "opacity-30" : "opacity-100"}`}>
        <div className="flexRowBetween h-screen">
          <div className="flex items-start flex-col">
            <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
              Login to your account!
            </h1>
            <div className="flexRowCenter cursor-pointer hover:scale-95 transition-all duration-100 gap-x-[10px] py-6 px-11 border border-dark-blue-v2 rounded-lg border-opacity-30 mt-8">
              <span className="text-2xl">
                <FcGoogle />
              </span>
              <button
                onClick={googleSignIn}
                className="text-base font-openSans text-dark-blue-v2 font-semibold"
              >
                Login with Google
              </button>
            </div>
            <form className="w-full mt-10" onSubmit={handleSubmit}>
              {inputData.map((data) => (
                <div key={data.id}>
                  {data.labelFor === "password" || data.labelFor === "email" ? (
                    <>
                      {data.inputType === "password" ? (
                        <Input
                          labelFor={data.labelFor}
                          labelValue={data.labelValue}
                          inputType={showPassword ? "text" : data.inputType}
                          inputValue={formValues[data.labelFor]}
                          onChange={handleInputChange}
                          errorMessage={errors[data.labelFor]}
                          className={
                            "py-5 border-b border-dark-blue border-opacity-30 text-dark-blue w-full"
                          }
                        >
                          {showPassword ? (
                            <IoMdEyeOff onClick={toggleShowPassword} />
                          ) : (
                            <IoMdEye onClick={toggleShowPassword} />
                          )}
                        </Input>
                      ) : (
                        <Input
                          labelFor={data.labelFor}
                          labelValue={data.labelValue}
                          inputType={data.inputType}
                          inputValue={formValues[data.labelFor]}
                          onChange={handleInputChange}
                          errorMessage={errors[data.labelFor]}
                          className={
                            "py-5 border-b border-dark-blue border-opacity-30 text-dark-blue w-full"
                          }
                        />
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
              <Button
                btnContent={"Login to Continue"}
                className={"w-full rounded-lg mt-10"}
              />
            </form>
            <p className="text-sm text-dark-blue font-openSans text-center mt-10">
              Don&apos;t have an account ?
              <span className="text-[#EA6C00] font-bold cursor-pointer hover:text-primary-purple transition-all duration-100">
                <Link to="/register">Sign In</Link>
              </span>
            </p>
          </div>
          <div className="h-full overflow-hidden">
            <picture>
              <img src={loginBanner} alt="" className="object-cover" />
            </picture>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
