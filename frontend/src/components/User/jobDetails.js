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
  const url = "/user/dashboard/" + props.match.params.jobId;
  const [isLoading, jobData, errorjobData] = useApiGet(api, url, []);
  const urlApplications = "/user/applications/";
  const [isLoadingApplications, userApplications, erroruserApplications] = useApiGet(api, urlApplications, []);
  const [isSubmitted, setIsSubmitted] = useState(false)

  // console.log('job complete:', jobData)
  // console.log('jobData applications jobData:', userApplications)

  let content
  if(isLoading) content = "loading all the details ..."
  else content = jobData ? <Job data={jobData} />: "something went wrong my man"

  // submitting the form
  const onSubmit = async (formjobData) => {
    try {
      await api.post(url, formjobData);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isPresent = (a, id) => {
    for (let i = 0; i < a.length; i++) {
      const element = a[i];
      if(element.jobId === id) return true
    }
    return false 
  }

  let formContent
  if(jobData){
    // SKIPPING DATE VALIDATION: AFTER DEADLINE. 
    // CAN BE HANDLED IN APPLICATIONS TOO
    if(jobData.positionsCurrent >= jobData.positionsMax){
      formContent = <button>Positions Filled up</button>
    } else if(jobData.applicationsCurrent >= jobData.applicationsMax){
      formContent = <button>Applications Filled up</button>
    } else if(jobData.applicationsCurrent >= jobData.applicationsMax){
      formContent = <button>Applications Filled up</button>
    } else if(!isLoadingApplications && userApplications) {
      // TO BE CHECKED
      // console.log(userApplications)
      if(userApplications[0].length && isPresent(userApplications[0], jobData._id)){
        formContent = <button>already applied</button>
      } else if(userApplications[1].length && isPresent(userApplications[1], jobData._id)){
        formContent = <button>you are shortlisted currently</button>
      } else if(userApplications[2].length && isPresent(userApplications[2], jobData._id)){
        formContent = <button>you are already accepted!</button>
      } else if(userApplications[3].length && isPresent(userApplications[3], jobData._id)){
        formContent = <button>you are REJECTED.</button>
      } else if (!isSubmitted){
        formContent = (
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
        )
      } else {
        formContent = "request submitted!"
      }
    } else {
      formContent = "login required!"
    }
  }

  return (
    <div className="JobDetails">
      {content}
      {formContent}
      {errorjobData !== ""? errorjobData: ""}
      {erroruserApplications !== ""? erroruserApplications: ""}
    </div>
  );
}
