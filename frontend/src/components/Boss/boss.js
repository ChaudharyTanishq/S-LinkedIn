import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

function BossProfile(props) {
  const { register, handleSubmit, errors } = useForm();
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/boss/profile");
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = (formData) => {
    // console.log(formData);
    try {
      // adding the key
      formData.email = data.email
      api.patch('/boss/profile', formData)
    } catch (error) {}

    setIsSubmitted(true)
  };

  let content;
  if (isLoading) content = "loading all the data for you ...";
  else if (!isLoading && !data) content = "login in to make profile changes";
  else if (data && !isSubmitted){
    content = (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <br></br>
          Name:{" "}
          <input
            name="name"
            defaultValue={data.name}
            placeholder="name"
            ref={register({ required: true })}
          />
          {errors.name && "name is required"}
          <br></br>
          Contact:{" "}
          <input
            name="contact"
            defaultValue={data.contact}
            placeholder="contact"
            ref={register({ required: true })}
          />
          {errors.contact && "contact is required"}
          <br></br>
          Password:{" "}
          <input
            name="password"
            defaultValue={data.password}
            placeholder="password"
            ref={register({ required: true, minLength: 8, maxLength: 128 })}
          />
          {errors.password && "password must be in between 8 and 128 letters"}
          <br></br>
          
					Bio:{" "}
          <input
            name="bio"
            defaultValue={data.bio}
            placeholder="bio"
            ref={register({ required: false, maxLength: 250 })}
          />
          {errors.bio && "bio error"}
          <br></br>
					
					
					<input type="submit" value="submit" />
        </form>

        <hr></hr>
      </div>
    );
  } else if (isSubmitted){
    content = "successfully updated!"
  }

  return (
    <div className="BossProfile">
      <h1>BossProfile</h1>
      {content}
    </div>
  );
}

export default BossProfile;

