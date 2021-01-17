import React, { useContext } from "react"
import { Job } from "../User/job"
import { generateApi, useApiGet } from "../Utility/api"
import { UserContext } from "../Utility/userContext"

function MyJobs(props) {
  const { authToken } = useContext(UserContext)
  const api = generateApi(authToken)
  const [isLoading, data, errorData] = useApiGet(api, "/boss/myJobs", [])

	let content = []

	if(isLoading){
		content = 'loading ...'
	} else if (!isLoading && !data){
		content = 'sigin needed!'
	} else{
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			content.push(<Job data={element} boss={true}/>)
		}
	}

  return (
    <div className="MyJobs">
      <h1>My Jobs</h1>
			{content}
		</div>
  )
}

export default MyJobs
