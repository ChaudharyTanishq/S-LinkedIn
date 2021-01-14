import React from 'react' 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { generateApi, useApiGet } from "./components/Utility/api";

import NavBar from './components/Utility/navbar'
import User from "./components/User/user";
import Boss from "./components/Boss/boss";
import Home from "./components/Utility/home";
import Login from './components/Utility/login';


function App(props) {
	const person = {
		'default': ['login', 'register'],
		'user': ['dashboard', 'profile', 'applications'],
		'boss': ['create', 'view', 'accepted']
	}

	
	// REMOVE THE HARDCODING HERE,
	// WITH TOKEN AND IDENTIFYING USER
	let who = 'default'
	const authToken = localStorage.getItem('person')
	// console.log(authToken)
	const api = generateApi(authToken)
	const [isLoading, data] = useApiGet(api, '/default/who')
	console.log(data)
	if(authToken){
		if(!isLoading && data === null) who = 'default'
		else if (!isLoading && data === true) who = 'boss'
		else if (!isLoading && data === false) who = 'user'
	}

	const currentPerson = person[who]

	return (
		<Router>
			<div className="App">
				<NavBar person={currentPerson} who={who}/>
				<h1>S-LinkedIn</h1>
				<Switch>
					<Route path="/default" exact component={Home}/>
					<Route path="/default/login" exact component={Login}/>
					<Route path="/user" component={User}/>
					{/* <Route path="/user/profile" component={User}/>
					<Route path="/user/dashboard" component={User}/>
					<Route path="/user/appplications" component={User}/> */}
					<Route path="/boss" component={Boss}/>
					{/* <Route path="/boss/view" component={Boss}/>
					<Route path="/boss/accepted" component={Boss}/> */}
				</Switch>
			</div>
		</Router>
	)
}

export default App;
