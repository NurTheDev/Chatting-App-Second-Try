import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div>
      <div className="container">
        <div className="flexRowBetween h-screen">
          <div>
            <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
              Login to your account!
            </h1>
            <div>
              <span>
                <FcGoogle />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
