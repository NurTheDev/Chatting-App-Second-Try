import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import registrationImg from "../assets/registrationBanner.png";
import Button from "../Common Component/Button";
import Input from "../Common Component/Input";
import inputData from "../lib/inputData";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const handleInput = (e) => {};
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <div className="container">
        <div className="flex justify-between items-center h-screen">
          <div className="flex flex-col space-y-14 justify-center h-screen w-1/2 px-40">
            <div>
              <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
                Get started with easily register
              </h1>
              <p className="font-nunito font-normal text-xl text-black-50 mt-4">
                Free register and you can enjoy it
              </p>
            </div>
            <form className="w-full">
              {inputData.map((data) => (
                <div key={data.id}>
                  {data.inputType === "password" ? (
                    <div>
                      <Input
                        labelFor={data.labelFor}
                        labelValue={data.labelValue}
                        inputType={showPassword ? "text" : data.inputType}
                        className="mb-10"
                      >
                        <IoMdEye onClick={toggleShowPassword} />
                      </Input>
                    </div>
                  ) : (
                    <Input
                      labelFor={data.labelFor}
                      labelValue={data.labelValue}
                      inputType={data.inputType}
                      className="mb-10"
                    />
                  )}
                </div>
              ))}

              <Button
                btnContent={"Sign up"}
                className={"w-full rounded-[86px]"}
              />
            </form>
            <p className="text-sm text-dark-blue </p>font-openSans text-center">
              Already have an account ?{" "}
              <span className="text-[#EA6C00] font-bold cursor-pointer hover:text-primary-purple transition-all duration-100">
                Sign In
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
