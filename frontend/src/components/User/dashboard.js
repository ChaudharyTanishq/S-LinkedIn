import React, { useContext } from 'react' 
import { generateApi, useApiGet } from '../Utility/api';
import { UserContext } from '../Utility/userContext';
import { Job } from './job';

function Dashboard(props) {
	const {authToken} = useContext(UserContext)
	const api = generateApi(authToken)
	const [isLoading, data, errorData] = useApiGet(api, '/user/dashboard', [])

	// the only case we bother about
	let content = []
	if(!isLoading && data){
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			content.push(<Job data={element} key={element._id}/>)
		}
	}
	
	return (
		<div className="Dashboard">
			<h1>Dashboard</h1>
			{content}
			{errorData !== ""? errorData: ""}
		</div>
	)
}

export default Dashboard;
