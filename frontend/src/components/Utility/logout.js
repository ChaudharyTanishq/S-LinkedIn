import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "./userContext";

function Logout(props) {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  // const {authToken, setauthToken} = useContext(UserContext)
  const {setauthToken} = useContext(UserContext)

  const handleLogout = (e) => {
    setauthToken('')
    setIsLoggedOut(true);
  };

  const renderLogout = () => {
    if (isLoggedOut) return (
      <div>
        <Redirect to="/default"/>
      </div>
    )
    else {
      return (
        <div>
          Are you sure you wanna logout?
          <button onClick={handleLogout}>Logout</button>
        </div>
      )
    }
  }

  return (
    renderLogout()
  );
}
export default Logout;
