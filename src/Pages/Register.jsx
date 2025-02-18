import Input from "../Common Component/Input";
import inputData from "../lib/inputData";
const Register = () => {
  return (
    <div>
      <div className="container">
        <div>
          <div>
            <div>
              <h1 className="text-dark-blue text-4xl font-bold font-nunito lead">
                Get started with easily register
              </h1>
              <p className="font-nunito font-normal text-xl text-black-50">
                Free register and you can enjoy it
              </p>
            </div>
            <form>
              {inputData.map((data) => (
                <Input
                  key={data.id}
                  labelFor={data.labelFor}
                  labelValue={data.labelValue}
                  inputType={data.inputType}
                  className="mb-10"
                />
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
