import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

// WORKS!
// AKA: DO NOT FUCKING TOUCH THIS
function Education(props) {
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState(props.data);
  const [isAllSubmitted, setIsAllSubmitted] = useState(false);

  const saveAllEducation = () => {
    // console.log('all education data: ',data)
    try {
      props.api.post("user/profile/education", data);
    } catch (error) {}

    setIsAllSubmitted(true);
  };

  const deleteEducation = (index) => {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      if (index != i) newData.push(data[i]);
    }
    setData(newData);
  };

  const onSubmit = (submitData) => {
    // console.log('education submit', data)
    setData((oldData) => oldData.concat(submitData));
    setIsSubmitted(true);
  };

  const expandEducation = (education) => {
    let educationContent = [];
    for (let i = 0; i < education.length; i++) {
      const element = education[i];
      // console.log(element)
      educationContent.push(
        <ul>
          <li>instituteName: {element.instituteName}</li>
          <li>yearStart: {element.yearStart}</li>
          <li>
            yearEnd: {element.yearEnd === "" ? "current" : element.yearEnd}
          </li>
          <button onClick={() => deleteEducation(i)}>Delete</button>
        </ul>
      );
    }
    return educationContent;
  };

  let content = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="instituteName"
        defaultValue=""
        placeholder="instituteName"
        ref={register({ required: true })}
      />
      {errors.instituteName && "instituteName is required"}
      <br></br>

      <input
        name="yearStart"
        defaultValue=""
        placeholder="yearStart"
        ref={register({ required: true })}
      />
      {errors.yearStart && "yearStart is required"}
      <br></br>

      <input
        name="yearEnd"
        defaultValue=""
        placeholder="yearEnd"
        ref={register({ required: false })}
      />
      {errors.yearEnd && "yearEnd is required"}
      <br></br>

      <input type="submit" value="Add Education!" />
    </form>
  );

  let endContent;
  if (isAllSubmitted) {
    endContent = "Saved Changes!";
  }

  return (
    <div>
      <h3>Education</h3>
      {expandEducation(data)}
      {content}
      <button onClick={saveAllEducation}>Save ALL education changes</button>
      {endContent}
    </div>
  );
}

function UserProfile(props) {
  const { register, handleSubmit, errors } = useForm();
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/user/profile");
  const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoadingSkills, skills, errorSkillsData] = useApiGet(api, '/boss/skillSet')

  // console.log(data.skills)

  const expandSkills = (skills) => {
    let skillContent = []

    if(!skills) return skillContent

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      skillContent.push(
        <li>{skill}</li>
      )
    }
    return <ul>{skillContent}</ul>
  }

  const onSubmit = (formData) => {
    // messing with skill set
    let x = formData.skills 
    x = x.replace(' ', '')
    x = x.split(',')
    formData.skills = x
    // console.log(formData);
    try {
      api.patch('/user/profile', formData)
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
          Email:{" "}
          <input
            name="email"
            defaultValue={data.email}
            placeholder="email"
            ref={register({ required: true })}
          />
          {errors.email && "name is required"}
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

          Your Current Skills:
          {data.skills.length?expandSkills(data.skills): "add some now!"}
          <br></br>

          Hot Skills Popular acress Jobs and other Users:
          {isLoadingSkills? "loading popular skills ...": expandSkills(skills)}
          <br></br>

          Skills (input comma separated values; new ones overwrite old ones):{" "}
          <input
            name="skills"
            defaultValue=""
            placeholder="name"
            ref={register({ required: false })}
          />
          {errors.skills && "some issue with skills. did you input correctly?"}
          <br></br>
          <input type="submit" value="submit" />
        </form>

        <hr></hr>
        <Education api={api} data={data.education} />
      </div>
    );
  } else if (isSubmitted){
    content = "successfully updated!"
  }

  return (
    <div className="UserProfile">
      <h1>UserProfile</h1>
      {content}
    </div>
  );
}

export default UserProfile;
