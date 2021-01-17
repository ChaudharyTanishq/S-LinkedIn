import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Job } from "../User/job";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";
import { Redirect } from 'react-router-dom'
import ApplicationDetails from "./jobApplicationDetails";

function DeletingJob(props){
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const url = props.urlDeleting;
  const [isDeleted, setIsDeleted] = useState(false)

  // handling submits for the forms
  const onSubmitDelete = () => {
    try {
      // console.log('deleting ... ')
      // console.log(url)
      api.delete(url)
      setIsDeleted(true)    
      // window.location.reload()
    } catch (error) {}
  }

  let content
  if(isDeleted){
    content = <Redirect to={'/boss/myJobs'}/>
  } else {
    content = (
      <div>
      <br></br>
      are you sure you want to delete this post??
      <br></br>
      <br></br>
      <button onClick={onSubmitDelete}>Confirm Delete</button>
    </div>
    )
  }

  return (
    <div>
      {content}
  </div>
  )
}

function UpdatingJob(props){
  const { register, handleSubmit, errors } = useForm();
  const api = props.api
  const url = props.url;
  const jobData = props.jobData;
  const [isUpdated, setIsUpdated] = useState(false)

  const onSubmitUpdate = (data) => {
    // console.log("new data from update: ", data);
    try {
      api.patch(url, data)
      setIsUpdated(true)
    } catch (error) {}
  };

  // date validation
  const isDate = (date) => {
    return !isNaN(Date.parse(date));
  };


  let content
  if(isUpdated){
    content = <Redirect to={url}/>
  } else {
    content = (
<form onSubmit={handleSubmit(onSubmitUpdate)}>
        <br></br>
        Update Job requirements
        <br></br>
        <br></br>
        positionsMax:{" "}
        <input
          name="positionsMax"
          defaultValue={jobData.positionsMax}
          placeholder="positionsMax"
          ref={register()}
        />
        <br></br>
        applicationsMax:{" "}
        <input
          name="applicationsMax"
          defaultValue={jobData.applicationsMax}
          placeholder="applicationsMax"
          ref={register()}
        />
        <br></br>
        dateDeadline:{" "}
        <input
          name="dateDeadline"
          defaultValue={jobData.dateDeadline}
          placeholder="dateDeadline"
          ref={register({ validate: isDate })}
        />
        <br></br>
        NOTE: date must be a valid date!
        <br></br>
        <br></br>
        <input type="submit" value="submit" />
      </form>
    )
  }

  return (
    <div>
      {content}
  </div>
  )
}

function BossJobDetails(props) {
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const url = "boss/myJobs/" + props.match.params.jobId;
  const [isLoading, jobData] = useApiGet(api, url, []);
  const [showBonus, setShowBonus] = useState("");

	// The below is for the basic job details as seen on user/dashboard
  let content;
  if (isLoading) content = "loading all the details ...";
  else if (!isLoading && !jobData)
    content = "something taking time ... pls hold tight";
  else {
    content = (
      <div>
        <Job data={jobData} boss={true}/>
        <button onClick={() => setShowBonus("delete")}>Delete</button>
        <button onClick={() => setShowBonus("update")}>Update</button>
        <button onClick={() => setShowBonus("applications")}>Applications</button>     
      </div>
    );
  }



  // show the bonus content
  let bonusContent;
  if (showBonus === "delete") {
    bonusContent = (
      <DeletingJob urlDeleting={url}/>
    );
  } else if (showBonus === "update") {
    bonusContent = (
      <UpdatingJob url={url} api={api} jobData={jobData}/>  
    );
  } else if (showBonus === "applications") {
    bonusContent = (
			<ApplicationDetails data={jobData} url={url}/>
    );
  }

  return (
    <div className="BossJobDetails">
      <h1>BossJobDetails</h1>
      {content}
      {bonusContent}
    </div>
  );
}

export default BossJobDetails;
