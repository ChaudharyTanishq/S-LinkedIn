import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";
import { useForm } from "react-hook-form";

function Applications(props) {
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/user/applications", []);
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [myRating, setMyRating] = useState(0)

  // submitting the form
  const onSubmit = async (jobId) => {
    try {
      // console.log("jobId:", jobId);
      // console.log("rating save:", myRating);
      await api.post('/user/rating', {jobId: jobId, rating: myRating});
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const expandArray = (a, accepted = false) => {
    let applications = [];
    for (let i = 0; i < a.length; i++) {
      const element = a[i];
      // console.log(element)
      
      let content
      if(!accepted) {
        content = (
          <li>
            <Link to={"/user/dashboard/" + element.jobId}>
              {element.jobTitle}
            </Link>
          </li>
        )
      } else if (isSubmitted) {
        content = (
          <li>
            <Link to={"/user/dashboard/" + element.jobId}>
              {element.jobTitle}
            </Link>
            {" saved rating"}
          </li>
        )
      } else {
        content = (
          <li>
            <Link to={"/user/dashboard/" + element.jobId}>
              {element.jobTitle}
            </Link>
            {" "}
            <select onChange={(e) => setMyRating(e.target.value)}>
              <option value={8}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            {" "}
            <button onClick={()=>onSubmit(element.jobId)}>Save Rating</button>
          </li>
        )
      }
      applications.push(content)
    }

    return <ul>{applications}</ul>;
  };

  let content;
  if (isLoading) content = "fetching the latest data ...";
  else if (data) {
    content = (
      <div>
        <div>Applied: {expandArray(data[0])}</div>
        <div>ShortListed: {expandArray(data[1])}</div>
        <div>Accepted: {expandArray(data[2], true)}</div>
        <div>Rejected: {expandArray(data[3])}</div>
      </div>
    );
  } else {
    content = "something went wrong my man";
  }
  return (
    <div className="Applications">
      <h1>Applications</h1>
      {content}
      {errorData !== "" ? errorData : ""}
    </div>
  );
}

export default Applications;
