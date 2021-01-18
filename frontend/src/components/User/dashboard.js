import React, { useContext, useState } from "react";
import { generateApi, useApiGet } from "../Utility/api";
import { UserContext } from "../Utility/userContext";
import { Job } from "./job";
import Fuse from "fuse.js";

function Dashboard(props) {
  const { authToken } = useContext(UserContext);
  const api = generateApi(authToken);
  const [isLoading, data, errorData] = useApiGet(api, "/user/dashboard", []);
  const [searchBar, setSearchBar] = useState("");
  const [searchBarJob, setSearchBarJob] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(Infinity);
  const [searchBarDuration, setSearchBarDuration] = useState(0);
  const [ascendingSortTitle, setAscendingSortTitle] = useState(false);
  const [ascendingSortSalary, setAscendingSortSalary] = useState(false);
  const [ascendingSortDuration, setAscendingSortDuration] = useState(false);

  // tips for searching
  let tips = [
    <li>setting duration 0 means indefinite. we show all jobs in that case </li>,
    <li>
      salary is reset to 0 in case of invalid inputs (try typing letters!)
    </li>,
    <li>all contions are AND together</li>,
  ];

  // searching for the deadline constraints
  const searchAfterDeadline = (content) => {
    let finalContent = [];
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      if (new Date() < new Date(element.dateDeadline))
        finalContent.push(element);
    }
    return finalContent;
  };

  // searching for the title constraints
  const searchTitle = (content) => {
    const fuse = new Fuse(content, {
      keys: ["title"],
      shouldSort: true,
    });
    const fuseSearchResults = fuse.search(searchBar);
		
		// extracting out the job item form the search results
		let finalContent = [];
    for (let i = 0; i < fuseSearchResults.length; i++) {
      const element = fuseSearchResults[i];
      finalContent.push(element.item);
		}
		
		// return what sorted order?
    if (ascendingSortTitle) return finalContent;
    else return finalContent.reverse();
	};
	
	// searching for the salary constraints
  const searchSalary = (content) => {
    let finalContent = [];
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      if (salaryMin <= element.salary && element.salary <= salaryMax)
        finalContent.push(element);
		}
		
		finalContent.sort((a, b)=> {return a.salary < b.salary ? 1: -1})
		if(ascendingSortSalary) return finalContent;
		else return finalContent.reverse();
  };

  // searching for the job type constraints
  const searchJobType = (content) => {
    let jobTypes = [];
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      jobTypes.push(element.jobType);
    }
    let finaljobTypes = jobTypes.filter((jobType) =>
      jobType.includes(searchBarJob)
    );
    let finalContent = [];
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      if (finaljobTypes.includes(element.jobType)) finalContent.push(element);
    }
    return finalContent;
  };

  // searching for the job duratoin
  const searchJobDuration = (content) => {
		content = content.filter((element)=>{
			if(element.duration < searchBarDuration) 
			return element;
		});

		content.sort((a, b)=> {return a.duration < b.duration ? 1: -1})

		if(ascendingSortDuration) return content;
		else return content.reverse();
  };

  const handleSalaryMin = (e) => {
    try {
      if (0 <= parseInt(e.target.value) && parseInt(e.target.value) < Infinity)
        setSalaryMin(parseInt(e.target.value));
      else setSalaryMin(0);
    } catch (error) {
      setSalaryMin(0);
    }
  };

  const handleSalaryMax = (e) => {
    try {
      if (0 <= parseInt(e.target.value) && parseInt(e.target.value) < Infinity)
        setSalaryMax(parseInt(e.target.value));
      else setSalaryMax(0);
    } catch (error) {
      setSalaryMax(Infinity);
    }
  };

  // filtering through relevant content
  let content = [];
  if (!isLoading && data) {
    for (let i = 0; i < data.length; i++) {
      content = searchAfterDeadline(data);
      content = searchTitle(content);
      content = searchJobType(content);
      content = searchSalary(content);
      content = searchJobDuration(content);
    }
  }

  // showing the relevant jobs, using the compontent Job to handle this part
  let displayContent = [];
  if (content.length) {
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      displayContent.push(<Job data={element} key={element._id} />);
    }
  } else {
    displayContent = "nothing relevant found. try broadneing your search";
  }

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>
      {/* title search */}
      Search:{" "}
      <input
        name="search"
        value={searchBar}
        placeholder="search"
        onChange={(e) => setSearchBar(e.target.value)}
      />
      <button onClick={() => setAscendingSortTitle(!ascendingSortTitle)}>
        Sort {ascendingSortTitle ? "Ascending" : "Descending"}
      </button>
      <br></br>
      {/* dropdown */}
      Job Type:{" "}
      <select onChange={(e) => setSearchBarJob(e.target.value)}>
        <option value="">any</option>
        <option value="fulltime">Full time</option>
        <option value="parttime">Part time</option>
        <option value="workathome">Work at home</option>
      </select>
      <br></br>
      {/* salary min */}
      Salary:{" "}
      <input
        name="salaryMin"
        value={salaryMin}
        placeholder="salaryMin"
        onChange={handleSalaryMin}
      />
      {/* salary max */}
      <input
        name="salaryMax"
        value={salaryMax}
        placeholder="salaryMax"
        onChange={handleSalaryMax}
      />
      <button onClick={() => setAscendingSortSalary(!ascendingSortSalary)}>
        Sort {ascendingSortSalary ? "Ascending" : "Descending"}
      </button>
      <br></br>

      {/* duration dropdown */}
			Duration:{" "}
      <select onChange={(e) => setSearchBarDuration(e.target.value)}>
        <option value={8}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
      </select>
			<button onClick={() => setAscendingSortDuration(!ascendingSortDuration)}>
        Sort {ascendingSortDuration ? "Ascending" : "Descending"}
      </button>
      <br></br>

      <div>
        <ul>{tips}</ul>
        <br></br>
        <hr></hr>
        {displayContent}
      </div>
      {errorData !== "" ? errorData : ""}
    </div>
  );
}

export default Dashboard;
