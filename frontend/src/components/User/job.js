import React from "react";
import { Link } from 'react-router-dom'

// simply lists all the jobs
export function Job(props) {

  // preparing job data
  const data = props.data;
  let skills = [];
  for (let i = 0; i < data.requiredSkillSet.length; i++) {
    const element = data.requiredSkillSet[i];
    skills.push(<li key={i}>{element}</li>);
  }

  console.log(data)

  return (
    <div className="Job">
      <Link to={props.boss? '/boss/myJobs/'+data._id:'/user/dashboard/'+data._id} data={data}><h3>{data.title}</h3></Link>
      <p>
        by: {data.recruiterName} at {data.recruiterEmail}
      </p>
      <ul className="positions">
        {" "}
        <h5>Positions</h5>
        <li>Current Active Positions: {data.positionsCurrent}</li>
        <li>Total Active Positions Needed: {data.positionsMax}</li>
      </ul>
      <ul className="applications">
        {" "}
        <h5>Applications</h5>
        <li>Current Active Applied Applications: {data.applicationsCurrent}</li>
        <li>Total Applications Allowed: {data.applicationsMax}</li>
      </ul>
      <ul className="dates">
        {" "}
        <h5>Dates</h5>
        <li>Date of Posting: {data.datePosting}</li>
        <li>Deadline Date: {data.dateDeadline}</li>
      </ul>
      <ul className="details">
        {" "}
        <h5>Details</h5>
        <li>Skills Required: <ul>{skills}</ul></li>
        <li>Job Type: {data.jobType}</li>
        <li>duration: {data.duration}</li>
        <li>salary: {data.salary}</li>
        {!data.rating.length ? <li>Job ratings: Unrated Job</li>:
        <li>Job Rating: {data.rating[0]} of {data.rating[1]}</li>
        }
      </ul>
    </div>
  );
}
