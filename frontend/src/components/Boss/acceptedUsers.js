import React, { useContext } from "react";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";

function AcceptedUsers(props) {
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/boss/accepted");

  const expandUsers = (users) => {
    let list = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const rating =
        user.rating[1] === 0 || isNaN(user.rating[1])
          ? "unrated"
          : user.rating[0] / user.rating[1];

      list.push(
        <ul>
          <li>{user.name}</li>
          <li>{user.date}</li>
          <li>{user.jobType}</li>
          <li>{user.jobTitle}</li>
          <li>{rating}</li>
        </ul>
      );
    }
    return list;
  };

  let content;
  if (isLoading) content = "loading ... pls wait";
  else if (!isLoading && !data) content = "login, stranger!";
  else {
    content = <div>{expandUsers(data)}</div>;
  }

  return (
    <div className="AcceptedUsers">
      <h1>AcceptedUsers</h1>
      {content}
    </div>
  );
}

export default AcceptedUsers;
