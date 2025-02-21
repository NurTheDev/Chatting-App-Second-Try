import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Input from "../Common Component/Input";
import inputData, { useTogglePasswordVisibility } from "../lib/inputData";
const Login = () => {
  const { showPassword, toggleShowPassword } = useTogglePasswordVisibility;
  return (
    <div>
      <div className="container">
        <div className="flexRowBetween h-screen">
          <div className="flex items-start flex-col">
            <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
              Login to your account!
            </h1>
            <div className="flexRowCenter gap-x-[10px] py-6 px-11 border border-dark-blue-v2 rounded-lg border-opacity-30 mt-8">
              <span className="text-2xl">
                <FcGoogle />
              </span>
              <p className="text-base font-openSans text-dark-blue-v2 font-semibold">
                Login with Google
              </p>
            </div>
            <form className="w-full mt-10">
              {inputData.map((data) => (
                <div key={data.id}>
                  {data.labelFor === "password" || data.labelFor === "email" ? (
                    <>
                      {data.inputType === "password" ? (
                        <Input
                          labelFor={data.labelFor}
                          labelValue={data.labelValue}
                          inputType={showPassword ? "text" : data.inputType}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
