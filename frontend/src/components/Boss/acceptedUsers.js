import React, { useContext, useState } from "react";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

function AcceptedUsers(props) {
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/boss/accepted");
  const [ascendingName, setAscendingName] = useState(false);
  const [ascendingTitle, setAscendingTitle] = useState(false);
  const [ascendingDate, setAscendingDate] = useState(false);
  const [ascendingRating, setAscendingRating] = useState(false);
  const [myRating, setMyRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false);


  // submitting the form
  const onSubmit = async (personId) => {
    try {
      // console.log("personId:", personId);
      // console.log("rating save:", myRating);
      await api.post('/boss/rating', {personId: personId, rating: myRating});
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const expandUsers = (users) => {
    let list = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(user)
      const rating =
        user.rating[1] === 0 || isNaN(user.rating[1])
          ? "unrated"
          : `${user.rating[0]} of ${user.rating[1]}`;

      list.push(
        <ul>
          <li>Job Title: {user.jobTitle}</li>
          <li>JobType: {user.jobType}</li>
          <li>Person Name: {user.name} {user.newName === user.name ? "":( "(new name: "+user.newName+")")}</li>
          <li>Date of Acceptance: {user.date}</li>
          <li>Rating: {rating}</li>
          {isSubmitted? " submitted!":
          <div>
            {" "}
            <select onChange={(e) => setMyRating(e.target.value)}>
              <option value={8}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            {" "}
            <button onClick={()=>onSubmit(user.personId)}>Save Rating</button>
          
          </div>
          }
          
        </ul>
      );
    }
    return list;
  };


  const filterName = (data) => {
    data = data.sort((a, b) => a.name > b.name);
    if(ascendingName) return data;
    else return data.reverse();
  }

  const filterTitle = (data) => {
    data = data.sort((a, b) => a.title > b.title);
    if(ascendingTitle) return data;
    else return data.reverse();
  }

  const filterRating = (data) => {
    data = data.sort((a, b) => {
      
      if (isNaN(a.rating[1])) return 1
      else if (isNaN(a.rating[1]) && isNaN(b.rating[1])) return -1

      return a.rating[0]/a.rating[1] > b.rating[0]/b.rating[1]
    });
    if(ascendingRating) return data;
    else return data.reverse();
  }

  const filterDate = (data) => {
    data = data.sort((a, b) => a.date > b.date);
    if(ascendingDate) return data;
    else return data.reverse();
  }

  let content;
  if (isLoading) content = "loading ... pls wait";
  else if (!isLoading && !data) content = "login, stranger!";
  else {
    if (!data.length) content = "No accepted users yet!";
    else {
      let preContent = filterName(data)
      preContent = filterTitle(preContent)
      preContent = filterDate(preContent)
      preContent = filterRating(preContent)

      content = (
        <div>
          Note: the filters get applied inorder
          <br></br>
          <button onClick={() => setAscendingName(!ascendingName)}>
            {ascendingName ? "Ascending name" : "Descending name"}
          </button>
          <button onClick={() => setAscendingTitle(!ascendingTitle)}>
            {ascendingTitle ? "Ascending title" : "Descending title"}
          </button>
          <button onClick={() => setAscendingRating(!ascendingRating)}>
            {ascendingRating ? "Ascending rating" : "Descending rating"}
          </button>
          <button onClick={() => setAscendingDate(!ascendingDate)}>
            {ascendingDate ? "Ascending date" : "Descending date"}
          </button>

          {expandUsers(preContent)}
        </div>
      );
    }
  }

  return (
    <div className="AcceptedUsers">
      <h1>AcceptedUsers</h1>
      {content}
    </div>
  );
}

export default AcceptedUsers;
