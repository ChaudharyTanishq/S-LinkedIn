import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

function CreateJob(props) {
	const {authToken} = useContext(UserContext)
	const api = generateApi(authToken)
	const [isLoading, recruiterData, errorRecruiterData] = useApiGet(api, '/default/who')
  const { register, handleSubmit, errors } = useForm();
  const [errorData, setErrorData] = useState("");
  const [isCreateJob, setIsCreateJob] = useState(false);
	const [jobType, setJobType] = useState('fulltime')

  const isDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const onSubmit = async (data) => {
		if(!isDate(data.dateDeadline)){
			setErrorData("deadline must looke like so: "+new Date())
			return
		}

		if(jobType === ''){
			setErrorData("select job type!")
			return 
		}

		try {
			data.jobType = jobType
			data.datePosting = new Date()
			data.recruiterName = recruiterData.name
			data.recruiterEmail = recruiterData.email
			console.log(data);
			await api.post("/boss/create", data);
      setIsCreateJob(true);
    } catch (error) {
      setErrorData(error.response.data.message);
    }
  };

  let content;
  if (isCreateJob) content = "job successfully created!";
  else if (isLoading){
		content = "fething your basic data"
	} else if (!isLoading && !recruiterData){
		content = "error fetching your data, boss. are you logged in?"
	} else if (recruiterData && !recruiterData.isBoss){
		content = "ey go away. this is only for recruiters, not users lmao"
	} else if (recruiterData && recruiterData.isBoss){
    content = (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="title"
            placeholder="title"
            ref={register({ required: true })}
          />
          {errors.title && "title is required"}
          <br></br>
					<input
            name="positionsMax"
            placeholder="positionsMax"
            ref={register({ required: true })}
          />
          {errors.positionsMax && "positionsMax is required"}
          <br></br>


					<input
            name="applicationsMax"
            placeholder="applicationsMax"
            ref={register({ required: true })}
          />
          {errors.applicationsMax && "applicationsMax is required"}
          <br></br>

					<input
            name="salary"
            placeholder="salary"
            ref={register({ required: true, min: 0 })}
          />
          {errors.salary && "salary is required and must be positive"}
          <br></br>


					<input
            name="duration"
            placeholder="duration"
            ref={register({ required: true, min: 0, max: 6 })}
          />
          {errors.duration && "duration is required and must be in [0,6]"}
					Note: duration is in months. 0 means indefinite
          <br></br>

					<select onChange={(e)=>setJobType(e.target.value)}>
						<option value="fulltime">Full time</option>
						<option value="parttime">Part time</option>
						<option value="workathome">Work at home</option>
					</select>
          <br></br>

					<input
            name="dateDeadline"
            placeholder="dateDeadline"
            ref={register({ required: true })}
          />
          {errors.dateDeadline && "dateDeadline is required"}

					<br></br>
					Quick Note: Dont worry if the weekday is wrong or skipped.
					<br></br>
					Rest should be correct though.
					<br></br>
					<br></br>

          <input type="submit" value="Submit" />
        </form>
        <br></br>
        <br></br>

        {errorData !== "" ? errorData : ""}
      </div>
    );
  }

  return (
    <div className="CreateJob">
      <h1>CreateJob</h1>
      {content}
    </div>
  );
}

export default CreateJob;
