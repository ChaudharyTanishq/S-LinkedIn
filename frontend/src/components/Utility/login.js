import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { generateApi } from "./api";
import { UserContext } from "./userContext";

function Login(props) {
  const { register, handleSubmit, errors } = useForm();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [errorData, setErrorData] = useState("")
  const {setauthToken} = useContext(UserContext)

  const onSubmit = async (data) => {
    const api = generateApi()
    try {
        const results = await api.post("/default/signin", data)
        setauthToken(results.data.token)
        setIsLoggedIn(true)
      } catch (error) {
        setErrorData(error.response.data)
      }
  }

  return (
    <div className="Login">
      {isLoggedIn && <Redirect to="/default"/>}
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="email"
          defaultValue=""
          placeholder="email"
          ref={register({ required: true })}
        />
        {errors.email && "Email is required"}
        <input
          name="password"
          defaultValue=""
          placeholder="password"
          ref={register({ required: true, minLength: 8, maxLength: 128 })}
        />
        {errors.password && "password must be in between 8 and 128 letters"}
        <input type="submit" value="submit" />
      </form>
      {errorData !== ""? errorData: ""}
    </div>
  );
}

export default Login;
