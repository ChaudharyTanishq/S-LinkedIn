import React from "react";
import { useForm } from "react-hook-form";
import { generateApi } from "./api";

function Login(props) {
  const { register, handleSubmit, errors } = useForm();
  
  const onSubmit = async (data) => {
    const api = generateApi()
    console.log("data:", data)
    try {
        const results = await api.post("/default/signin", data)
        console.log("results:", results)
        localStorage.setItem('person', results.data.token)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="Login">
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
    </div>
  );
}

export default Login;
