import React from "react";
import { Link } from 'react-router-dom'

// simply lists all the jobs
export function Job(props) {

  // preparing job data
  const data = props.data;
  let skills = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    skills.push(<li key={i}>{element}</li>);
  }

  return (
    <div className="Job">
      <Link to={props.boss? '/boss/myJobs/'+data._id:'/user/dashboard/'+data._id} data={data}><h3>{data.title}</h3></Link>
      <p>
        by: {data.recruiterName} at {data.recruiterEmail}
      </p>
      <ul className="positions">
        {" "}
        <h5>Positions</h5>
        <li>{data.positionsCurrent}</li>
        <li>{data.positionsMax}</li>
      </ul>
      <ul className="applications">
        {" "}
        <h5>Applications</h5>
        <li>{data.applicationsCurrent}</li>
        <li>{data.applicationsMax}</li>
      </ul>
      <ul className="dates">
        {" "}
        <h5>Dates</h5>
        <li>{data.datePosting}</li>
        <li>{data.dateDeadline}</li>
      </ul>
      <ul className="details">
        {" "}
        <h5>Details</h5>
        <ul>Skills Required: {skills}</ul>
        <li>Job Type: {data.jobType}</li>
        <li>duration: {data.duration}</li>
        <li>salary: {data.salary}</li>
      </ul>
    </div>
  );
}
