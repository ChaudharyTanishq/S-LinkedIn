import React, { useContext, useState } from "react";
import { generateApi } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

function ApplicationDetails(props) {
  const { authToken } = useContext(UserContext)
  const api = generateApi(authToken)

  // setting up status lists
  const [appliedApplications, setAppliedApplications] = useState(
    props.data.appliedApplications
  );
  const [shortListedApplications, setShortListedApplications] = useState(
    props.data.shortListedApplications
  );
  const [acceptedApplications, setAcceptedApplications] = useState(
    props.data.acceptedApplications
  );
  const [rejectedApplications, setRejectedApplications] = useState(
    props.data.rejectedApplications
  );

  // SHORTLISTS THE USER
  const shortList = (data) => {
    setAppliedApplications(
      appliedApplications.filter(
        (application) => application.personId != data.personId
      )
    );
    setShortListedApplications(shortListedApplications.concat(data));
  };

  // ACCEPTS THE USER
  const accept = (data) => {
    setShortListedApplications(
      shortListedApplications.filter(
        (application) => application.personId != data.personId
      )
    );
    setAcceptedApplications(acceptedApplications.concat(data));
  };

  // REJECTS THE USER - WORKS FROM ANY LIST
  // BY FILTERING THROUGH ALL OF THEM
  const reject = (data) => {
    setAppliedApplications(
      appliedApplications.filter(
        (application) => application.personId != data.personId
      )
    );
    setShortListedApplications(
      shortListedApplications.filter(
        (application) => application.personId != data.personId
      )
    );
    setAcceptedApplications(
      acceptedApplications.filter(
        (application) => application.personId != data.personId
      )
    );
    setRejectedApplications(rejectedApplications.concat(data));
  };

  // SAVES THE ENTIRE CHANGE SHIT
  // WORKS HELL YEA
  const submitApplicationStatus = () => {
    let data = [
      appliedApplications,
      shortListedApplications,
      acceptedApplications,
      rejectedApplications,
    ];
    // console.log('done!', data);
    api.post(props.url, data);
    window.location.reload()
  };

  // expansion of people inside a particular application status
  const expandArray = (a, func, buttonName) => {
    let applications = [];
    for (let i = 0; i < a.length; i++) {
      const element = a[i];
      let skills = [];
      try {
        for (let j = 0; j < element.skills.length; j++) {
          const elementSkill = element.skills[j];
          skills.push(<li key={j}>{elementSkill}</li>);
        }
      } catch (error) {}

      let application = (
        <li key={i}>
          <ul>
            <li>Name: {element.name}</li>
            <li>SOP: {element.SOP}</li>
            <li>
              Skills: <ul>{skills}</ul>
            </li>
            <li>Resume: {element.resume}</li>
            <li>Date of Application: {element.date}</li>
          </ul>
          {func ? (
            <button onClick={() => func(element)}>{buttonName}</button>
          ) : (
            ""
          )}
          {buttonName !== "empty" ? (
            <button onClick={() => reject(element)}>Reject</button>
          ) : (
            ""
          )}
        </li>
      );
      applications.push(application);
    }

    return <ul>{applications}</ul>;
  };

  return (
    <div className="ApplicationDetails">
      <h2>ApplicationDetails</h2>
      <div>
        Listing candidates
        <div>
          <div>
            Applied: {expandArray(appliedApplications, shortList, "Shortlist")}
          </div>
          <div>
            ShortListed:
            {expandArray(shortListedApplications, accept, "Accept")}
          </div>
          <div>Accepted: {expandArray(acceptedApplications, "", "")}</div>
          <div>Rejected: {expandArray(rejectedApplications, "", "empty")}</div>
        </div>
        <button onClick={submitApplicationStatus}>Save changes</button>
      </div>
    </div>
  );
}

export default ApplicationDetails;
