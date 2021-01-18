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
  const [durationMin, setDurationMin] = useState(1);
  const [durationMax, setDurationMax] = useState(7);
  const [ascendingSortTitle, setAscendingSortTitle] = useState(false);
  const [ascendingSortSalary, setAscendingSortSalary] = useState(false);
  const [ascendingSortDuration, setAscendingSortDuration] = useState(false);

  // tips for searching
  let tips = [
    <li>setting duration 0 is equal to indefinite </li>,
    <li>
      setting min-duration 0 will show all results (and overwrite max-duration){" "}
    </li>,
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

  // // self implemented searching (what a waste of time ;-;)
  // // searching for the title
  // const searchTitle = (content) =>{
  // 	let titles = []
  // 	for (let i = 0; i < content.length; i++) {
  // 		const element = content[i];
  // 		titles.push(element.title)
  // 	}
  // 	let finaltitles = titles.filter(titles => titles.includes(searchBar))
  // 	let finalContent = []
  // 	for (let i = 0; i < content.length; i++) {
  // 		const element = content[i];
  // 		if(finaltitles.includes(element.title)) finalContent.push(element)
  // 	}
  // 	return finalContent
  // }

  // searching for the title
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

  // searching for the time constraints
  const searchDuration = (content) => {
    let finalContent = [];
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      if (durationMin === 0) finalContent.push(element);
      else if (durationMin < element.duration && element.duration < durationMax)
        finalContent.push(element);
    }
		finalContent.sort((a, b)=> {return a.duration < b.duration ? 1: -1})
		if(ascendingSortDuration) return finalContent;
		else return finalContent.reverse();
	};

  // searching for the job
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
    // console.log(e.target.value)
    try {
      if (0 <= parseInt(e.target.value) && parseInt(e.target.value) < Infinity)
        setSalaryMax(parseInt(e.target.value));
      else setSalaryMax(0);
    } catch (error) {
      setSalaryMax(Infinity);
    }
  };

  const handleDurationMin = (e) => {
    try {
      if (1 <= parseInt(e.target.value) && parseInt(e.target.value) <= 7)
        setDurationMin(parseInt(e.target.value));
      else setDurationMin(0);
    } catch (error) {
      setDurationMin(0);
    }
  };

  const handleDurationMax = (e) => {
    try {
      if (1 <= parseInt(e.target.value) && parseInt(e.target.value) <= 7)
        setDurationMax(parseInt(e.target.value));
      else setDurationMax(0);
    } catch (error) {
      setDurationMax(0);
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
      content = searchDuration(content);
    }
  }

  // showing the relevant jobs
  let displayContent = [];
  if (content.length) {
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      displayContent.push(<Job data={element} key={element._id} />);
    }
  } else {
    displayContent = "nothing relevant found. try broadneing your search";
  }

  // console.log('searching: ', searchBar)
  // console.log('job: ', searchBarJob)
  // console.log('all content',content)
  // console.log('duration min', durationMin)
  // console.log('duration max', durationMax)

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
      {/*  durationMin */}
      Duration:
      <input
        name="durationMin"
        value={durationMin}
        placeholder="durationMin"
        onChange={handleDurationMin}
      />
      {/* durationMax */}
      <input
        name="durationMax"
        value={durationMax}
        placeholder="durationMax"
        onChange={handleDurationMax}
      />
      <button onClick={() => setAscendingSortDuration(!ascendingSortDuration)}>
        Sort {ascendingSortDuration ? "Ascending" : "Descending"}
      </button>
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
