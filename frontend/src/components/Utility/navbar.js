import React from 'react'
// import Home from "./home"
import { Link } from 'react-router-dom'

function NavBar(props) {
	let paths = [<Link to={'/default'} key={0}><li>Home</li></Link>]
	for (let i = 0; i < props.person.length; i++) {
		const element = props.person[i]
		const link = '/'+ props.who + '/' + element
		paths.push(<Link to={link} key={i+1}><li>{element}</li></Link>)
	}

	return (
		<div className="NavBar">
			<h1>Navbar</h1>
			{paths}
		</div>
	)
}

export default NavBar
