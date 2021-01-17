import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { generateApi, useApiGet } from '../Utility/api'
import { UserContext } from "../Utility/userContext";

function Applications(props) {
    const {authToken} = useContext(UserContext)
    const api = generateApi(authToken)
    const [isLoading, data, errorData] = useApiGet(api, '/user/applications', [])

    const expandArray = (a)=>{
      let applications = []
      for (let i = 0; i < a.length; i++) {
        const element = a[i];
        // console.log(element)
        applications.push(<li><Link to={'/user/dashboard/'+element.jobId}>{element.jobTitle}</Link></li>)
      }

      return (
        <ul>
          {applications}
        </ul>
      )
    }

    let content
    if(isLoading) content = "fetching the latest data ..."
    else if(data){
      content =(      
      <div>
        <div>Applied: {expandArray(data[0])}</div>
        <div>ShortListed: {expandArray(data[1])}</div>
        <div>Accepted: {expandArray(data[2])}</div>
        <div>Rejected: {expandArray(data[3])}</div>
      </div>
      ) 
    } else {
      content = "something went wrong my man"
    }
	return (
		<div className="Applications">
			<h1>Applications</h1>
      {content}
      {errorData !== ""? errorData: ""}
		</div>
	)
}

export default Applications