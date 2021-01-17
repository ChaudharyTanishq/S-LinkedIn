import React, { useContext } from 'react'
import { generateApi, useApiGet } from '../Utility/api'
import { UserContext } from '../Utility/userContext'

function AcceptedUsers(props) {
    // const {authToken} = useContext(UserContext)
    // const api = generateApi(authToken)
    // const [isLoading, data, errorData] = useApiGet(api, '')
	return (
		<div className="AcceptedUsers">
			<h1>AcceptedUsers</h1>
		</div>
	)
}

export default AcceptedUsers
