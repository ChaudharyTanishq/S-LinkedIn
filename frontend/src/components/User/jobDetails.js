import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";
import { Job } from "./job";

// TODO: ADD LOGIC FOR
// DEADLINE/FULL/LIMIT/APPLIED/APPLY
export function JobDetails(props) {
  const { register, handleSubmit, errors } = useForm();

  const {authToken} = useContext(UserContext)
  const api = generateApi(authToken);
  const url = "/user/" + props.match.params.jobId;
  const [isLoading, data, errorData] = useApiGet(api, url, []);
  const [isSubmitted, setIsSubmitted] = useState(false)

  let content
  if(isLoading) content = "loading all the details ..."
  else content = data ? <Job data={data} />: "something went wrong my man"

  // submitting the form
  const onSubmit = async (formData) => {
    try {
      await api.post(url, formData);
      setIsSubmitted(true);
      // ALSO UPDATE THE POSITION AND APPLICATION COUNTERS
      // TRY USING BOSS' ROUTES!
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="JobDetails">
      {content}
      {!isSubmitted && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="SOP"
            defaultValue=""
            placeholder="SOP"
            ref={register({ required: true, minLength: 8, maxLength: 250 })}
          />
          {errors.SOP && "Valid SOP is required within [8, 250]"}
          <input type="submit" value="Apply" />
        </form>
      )}
      {isSubmitted && "request submitted!"}
      {errorData !== ""? errorData: ""}
    </div>
  );
}
