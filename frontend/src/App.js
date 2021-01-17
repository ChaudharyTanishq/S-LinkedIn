import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { generateApi, useApiGet } from "./components/Utility/api";

import NavBar from "./components/Utility/navbar";
import User from "./components/User/user";
import Boss from "./components/Boss/boss";
import Home from "./components/Utility/home";
import Login from "./components/Utility/login";
import Dashboard from "./components/User/dashboard";
import { JobDetails } from "./components/User/jobDetails";
import Logout from "./components/Utility/logout";
import { UserContext } from "./components/Utility/userContext";
import Applications from "./components/User/applications";
import MyJobs from "./components/Boss/myJobs";
import BossJobDetails from "./components/Boss/jobDetails";
import ApplicationDetails from "./components/Boss/jobApplicationDetails";
import CreateJob from "./components/Boss/jobCreate";
import Register from "./components/Utility/register";
import AcceptedUsers from "./components/Boss/acceptedUsers";
import BossProfile from "./components/Boss/boss";
import UserProfile from "./components/User/profile";

function App() {
  const person = {
    default: ["login", "register"],
    user: ["dashboard", "profile", "applications"],
    boss: ["create", "myJobs", "accepted"],
  };
  
  // NOTE WORKING
  // useEffect(()=>{
  //   const token = localStorage.getItem('person')
  //   setauthToken(token)
  // }, [])
  
  const [authToken, setauthToken] = useState('');


  let who = "default";
  let personName = "";
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/default/who", [authToken]);
  if (authToken) {
    if (!isLoading && data === null) who = "default";
    else if (!isLoading && data.isBoss === true) {
      who = "boss";
      personName = data.name;
    } else if (!isLoading && data.isBoss === false) {
      who = "user";
      personName = data.name;
    }
  }
  // setting the current person
  const currentPerson = person[who];

  return (
    <Router>
      <div className="App">
        <NavBar person={currentPerson} who={who} personName={personName} />
        <h1>S-LinkedIn</h1>
        <p>the S stands for hope on superman's planet</p>
        <p>the S stands for shit on my website</p>
        <Switch>
          <UserContext.Provider value={{ authToken, setauthToken }}>
            <Route path="/default" exact component={Home} />
            <Route path="/default/login" exact component={Login} />
            <Route path="/default/logout" exact component={Logout} />
            <Route path="/default/register" exact component={Register} />
            <Route path="/user" exact component={User} />
            <Route path="/user/profile" exact component={UserProfile}/>
            <Route path="/user/applications" exact component={Applications}/>
            <Route path="/user/dashboard" exact component={Dashboard} />
            <Route path="/user/dashboard/:jobId" exact component={JobDetails} />
            <Route path="/boss" exact component={Boss} />
            <Route path="/boss/profile" component={BossProfile}/>
            <Route path="/boss/accepted" component={AcceptedUsers}/>
            <Route path="/boss/create" component={CreateJob}/>
            <Route path="/boss/myJobs" exact component={MyJobs} />
            <Route path="/boss/myJobs/:jobId" exact component={BossJobDetails} />
            <Route path="/boss/myJobs/:jobId/applications" exact component={ApplicationDetails} />
          </UserContext.Provider>
        </Switch>
      </div>
      {/* {errorData !== ""? errorData: ""} */}
    </Router>
  );
}

export default App;
