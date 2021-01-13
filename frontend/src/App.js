import React, { useEffect } from 'react' 
import { useApiGet } from './components/api';

function App(props) {
	const [isLoading, data] = useApiGet('/user')
	
	let content 
	if (isLoading) content = 'loading ...'
	else if (!data) content = 'error fetching data'
	else {
		content = 'in progress'
		for (let i in data){
			console.log(data[i])
			console.log("=================================")
		}
	}

	return (
		<div className="App">
			<h1>{props.important}</h1>
			{content}
		</div>
	);
}

export default App;
