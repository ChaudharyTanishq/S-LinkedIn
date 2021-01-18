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

  // submitting the form
  const onSubmit = async (formjobData) => {
    try {
      console.log("rating save");
      // await api.post(url, '');
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
      applications.push(
        <li>
          <Link to={"/user/dashboard/" + element.jobId}>
            {element.jobTitle}
          </Link>
          {!accepted ? (
            ""
          ) : isSubmitted ? (
            "saved!"
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                name="rating"
                defaultValue=""
                placeholder="rating"
                ref={register({ required: true, min: 0, max: 5 })}
              />
              {errors.SOP && "Valid rating is required within [0, 5]"}
              <input type="submit" value="Apply" />
            </form>
          )}
        </li>
      );
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
