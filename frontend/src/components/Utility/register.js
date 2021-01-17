import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
// import { Redirect } from "react-router-dom";
import { generateApi } from "./api";
import { UserContext } from "./userContext";

function Register(props) {
  const { register, handleSubmit, errors } = useForm();
  const [errorData, setErrorData] = useState("");
  const [isregistered, setIsRegistered] = useState(false);
  const onSubmit = async (data) => {
    if (data.password2 != data.password)
      setErrorData("passwords must be the same");
    else {
      try {
        delete data["password2"];
        const api = generateApi();
        await api.post("/default/signup", data);
        setIsRegistered(true);
      } catch (error) {
        setErrorData(error.response.data);
      }
    }
  };

  let content;
  if (isregistered) content = "done!";
  else {
    content = (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="email"
            placeholder="email"
            ref={register({ required: true })}
          />
          {errors.email && "Email is required"}
          <input
            name="name"
            placeholder="name"
            ref={register({ required: true, minLength: 4, maxLength: 32 })}
          />
          {errors.name && "name is required, must be in [4,32]"}
          <input
            name="password"
            placeholder="password"
            ref={register({ required: true, minLength: 8, maxLength: 128 })}
          />
          {errors.password && "password must be in between 8 and 128 letters"}
          <input
            name="password2"
            placeholder="password2"
            ref={register({ required: true, minLength: 8, maxLength: 128 })}
          />
          {errors.password2 && "password2 must be in between 8 and 128 letters"}
          <br></br>
          Are you a boss?
          <input
            type="checkbox"
            name="isBoss"
            ref={register({ required: false })}
          />{" "}
          Yes
          {errors.isBoss && " select"}
          <input type="submit" value="Submit" />
        </form>
        <br></br>
        <br></br>

        {errorData !== "" ? errorData : ""}
      </div>
    );
  }

  return (
    <div className="Register">
      <h1>Register</h1>
      {content}
    </div>
  );
}

export default Register;
