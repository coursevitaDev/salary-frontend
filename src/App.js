import './App.css';
import {  useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import { useRef } from 'react';
import DragNdrop from './components/dragdrop';
import Category from './components/Category/Category';
import ExperienceCategory from './components/ExperienceCategory/ExperienceCategory';
import "@fontsource/bebas-neue"; // Defaults to weight 400
import { IoIosInformationCircleOutline } from "react-icons/io";


function App() {
  const [ClickInfoVisible, setClickInfoVisible] = useState(false)
  const [file, setfile] = useState();
  const [Skill, ] = useState("");
  const [Skills, setSkills] = useState([])
  const [result, setResult] = useState(null);
  const salaryEstimateRef = useRef(null);
  const [certifcates, setCertificates] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [knowMore, setKnowMore] = useState(false)
  const [knowMoreIndex, setKnowMoreIndex] = useState()
  const [Experience, setExperience] = useState([])
  const [selectedSkills, setSelectedSkills] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEXPCategory, setSelectedEXPCategory] = useState("");
  const [infovisible, setinfoVisible] = useState(false);
    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Update state with selected category
        console.log("Selected Category:", category); // Log the selected category
    };
    const handleEXPCategoryChange = (category) => {
      setSelectedEXPCategory(category); // Update state with selected category
      console.log("Selected EXP Category:", category); // Log the selected category
  };

  const [, forceRender] = useState(0);
  useEffect(() => {
    forceRender((prev) => prev + 1);
  }, [skillsLoading]);
  // const fetchSkillsData = async (skills) => {
  //   try {
  //     const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/search", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ skills }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }

  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return null;
  //   }
  // };


const handleRefresh = async () => {
  if (!Array.isArray(Skills)) {
    console.error("Skills should be an array.");
    return;
  }
  try {
    const category_list = result.length > 0 ? result[0]['category_list'] : [];
    console.log('category_list:',category_list)
    setRefreshLoading(true)
    const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Skills, selectedCategory, category_list, selectedEXPCategory }), // Pass skills directly
    });
    const data = await response.json();
    
    console.log('refresh successful,',data)
    console.log('result', result)
    try{
    for (let i = 0; i < result.length; i++) {
      if (result[i]['category'] === data[i]['category']) {
          // Copy all fields from data[i] to result[i], except category
          Object.keys(data[i]).forEach(key => {
              if (key !== 'category') {
                  result[i][key] = data[i][key];
              }
          });
      }
  }
}catch(e){
  console.log(e)
}
    
    setSelectedSkills({})
    setRefreshLoading(false)


  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



// const handleSearch = async () => {
//   if (
//     !Array.isArray(Skills) || Skills.length === 0 ||
//     !Array.isArray(certificates) || certificates.length === 0 ||
//     !Array.isArray(Experience) || Experience.length === 0 ||
//     !selectedCategory
//   ) {
//     alert("Invalid input: Ensure Skills, Certificates, Experience, and selectedCategory are properly set.");
//     return;
//   }

//   try {
//     setResultsLoading(true);

//     const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/search", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         skills: Skills,
//         certificates: certificates,
//         experience: Experience,
//         selectedCategory,
//         selectedEXPCategory
//       }),
//     });

//     const data = await response.json();
//     setResult(data);
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     setResultsLoading(false);
//   }
// };
const handleSearch = async () => {
  if (
    !Array.isArray(Skills) || Skills.length === 0 ||
    !Array.isArray(certifcates) || certifcates.length === 0 ||
    !Array.isArray(Experience) || Experience.length === 0 ||
    !selectedCategory
  ) {
    alert("Invalid input: Ensure Skills, Certificates, Experience, and selectedCategory are properly set.");
    return;
  }

  try {
    setResultsLoading(true);

    const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: Skills,
        certificates: certifcates,
        experience: Experience,
        selectedCategory,
        selectedEXPCategory
      }),
    });

    const data = await response.json();
    setResult(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setResultsLoading(false);
  }
};



  
  const [masterSkillList, setmasterSkillLiSt] = useState([]);
  const [, setSuggestions] = useState([]);
  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     setSkill()
  //     const filtered = masterSkillList.filter((x) =>
  //       x.toLowerCase().startsWith(Skill.toLowerCase())
  //     );
  //     if (filtered) {
  //       setSkills([...Skills, filtered[0]])
  //     } else {
  //       console.alert('skill not found')
  //     }

  //   }
  // };



  useEffect(() => {
    fetch('/Technology_master_skills.csv')
      .then(res => res.text())
      .then(data => {
        const parseData = Papa.parse(data, { header: false })

        const skills = parseData.data.map(row => row[0]).filter(Boolean);

        setmasterSkillLiSt(skills)
      }
      ).catch(error => console.error(error))
  }, [])
  useEffect(() => {
    if (Skill) {
      const filtered = masterSkillList.filter((x) =>
        x.toLowerCase().startsWith(Skill.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [Skill, masterSkillList]);


 useEffect(() => {
  const filesubmit = async () => {
    if (!file) return;

    try {
      setSkills([]);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("https://salary-predictor-backend-x7ej.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully:", response.data);
      setSkills(response.data.skills);
      setCertificates(response.data.certificates);
      setExperience(response.data.experiences);
      setSkillsLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
    }
  };

  if (file) {
    setSkillsLoading(true);
    filesubmit();
  }
}, [file]);

  // const closeHandle = () => {
  //   setfile(null)
  //   setExtracted(null)
  // }


  const handleFilesSelected = (files) => {

    if (files.length > 0) {
      setfile(files[0]); // Take the first file
    }
  };





 

  const [relevantExperiences,setrelevantExperiences] = useState([])

  const handleKnowMore = (x) => {
    setKnowMore(true)
    setKnowMoreIndex(x)
    setrelevantExperiences(Object.entries(result?.[x]?.['Experience'] || {}).filter(([_, isRelevant]) => isRelevant));
    setSelectedSkills({})
  }

 


 

  // Function to toggle skill selection
  const toggleSkill = (skill, index) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle selected state for the clicked index
    }));
    setSkills([...Skills, skill])
  };

  const removeSkill = (skill, index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };



  
  //   const handleKeyDown = (e) => {
  //     if (suggestions.length === 0) return;
  
  //     if (e.key === "ArrowDown") {
  //       setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
  //     } else if (e.key === "ArrowUp") {
  //       setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
  //     } else if (e.key === "Enter" && activeIndex >= 0) {
  //       let selectedSkill = activeIndex >= 0 ? suggestions[activeIndex] : Skill;

  //     if (selectedSkill) {
  //       setSkill(selectedSkill);
  //       setSuggestions([]);
  //       setActiveIndex(-1);

  //       const filtered = masterSkillList.filter((x) =>
  //         x.toLowerCase().startsWith(selectedSkill.toLowerCase())
  //       );

  //       if (filtered.length > 0) {
  //         setSkills([...Skills, filtered[0]]);
  //       } else {
  //         alert("Skill not found");
  //       }
  //     }
  //   }
  // }
  

  return (
    <div className="App">
      <div className='input-container'>
        <div className='title-container'>
          <div className='Title' style={{  fontFamily: 'Bebas Neue, sans-serif', fontSize: "80px", letterSpacing: '-1px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }}>
            Salary Predictor
          </div>
        </div>
        <div className='main-body'>
          <div className='skill-input'>
          <div className="p-4">
            <Category onCategorySelect={handleCategoryChange} />
            {/* {selectedCategory && <p>Selected: {selectedCategory}</p>} */}
        </div>
        <div className="p-4">
            <ExperienceCategory onEXPCategorySelect={handleEXPCategoryChange} />
            {/* {selectedCategory && <p>Selected: {selectedCategory}</p>} */}
        </div>
            {/* <div className='manual-skillInput'>
              <span className='manualTitle'>Manual Skill Input :</span>

              <input type='text' className='inputbox' value={Skill} placeholder='Enter your skill' onKeyDown={handleKeyDown} onChange={(e) => setSkill(e.target.value)} />
              <IoIosSearch
                style={{
                  position: "absolute",
                  right: "72px",
                  top: "61%",
                  transform: "translateY(-50%)",
                  fontSize: "40px",
                  color: "gray",
                  cursor: "pointer",
                  zIndex: "1000",

                }}
                onClick={handleSearch}
              />
            </div>

            <div>
              {suggestions.length > 0 && (
                // <div className='Suggestionbox'>
                //   {suggestions.map((college) => (
                //     <div
                //       key={college}
                //       onClick={() => {
                //         setSkill(college);
                //         setSuggestions([]);
                //       }}
                //       style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ccc", borderRadius: "10px", borderLeft: "0px", borderRight: "0px" }}
                //     >
                //       {college}
                //     </div>
                //   ))}
                // </div>
                <div className="Suggestionbox">
                {suggestions.map((college, index) => (
                  <div
                    key={college}
                    onClick={() => {
                      setSkill(college);
                      setSuggestions([]);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #ccc",
                      borderRadius: "10px",
                      backgroundColor: index === activeIndex ? "#f0f0f0" : "white",
                    }}
                  >
                    {college}
                  </div>
                      ))}
                </div>
              )}
            </div> */}
            <div className='upload-container'>
              <span className='resumeTitle' >Resume Input :</span>
              <DragNdrop onFilesSelected={handleFilesSelected} width="450px" height="200px" />
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {/* <div className='select-experience'>
            <span className='extractedTitle'>
            <span>Experience Category :</span>
            </span>
            <input type='text' className='inputbox' value={Skill} placeholder='Search category...' onKeyDown={handleKeyDown} onChange={(e) => setSkill(e.target.value)} />
              
            </div> */}
          <div className='extracted-body'>
            <span className='extractedTitle'>
              <span>Your skills:</span>
              <span
              className="info-wrapper"
      onMouseEnter={() => setinfoVisible(true)}
      onMouseLeave={() => setinfoVisible(false)}
    >
                    <IoIosInformationCircleOutline />

      {infovisible && (
        <div className="tooltip">
          You can remove skills by clicking on them
        </div>
      )}
    </span>

              </span>
            {skillsLoading === true && (
              <div className='loading-Container'>
                <span style={{ fontSize: "40px", fontWeight: "550", color: "grey", letterSpacing: "-2px" }}>Loading</span>
                <div ><span className="loader"></span></div>
              </div>
            )}

            <div className='skillBox-Container'>

              {/* {Skills?.map((x) => (
                <>
                  <span className='skillBox' key={x}>{x}</span>
                </>
              ))} */}
              {Array.isArray(Skills) ? (
    Skills.map((x,index) => (
      <span className='skillBox' onClick={()=>removeSkill(x,index)} key={index}>{x}</span>
    ))
  ) : (
    <p style={{ color: 'red' }}>Something went wrong. Unable to load skills. Please try again.</p>
  )}
            </div>

          </div>
        </div>
        </div>
        <div className='btn-container'>
          <button className='salary-estimate-button' onClick={handleSearch}>

            {resultsLoading === false ? (
              <span> estimate</span>)
              : (<div className='results-container'>
                <div className='results-loader'>
                </div>
              </div>)
            }


          </button>

          <div className='certifications-body'><span className='certificationTitle'>Number of Certifications:<span style={{ marginLeft: "20px", fontSize: "40px", fontWeight: "450", color: "grey" }}>{certifcates.length}</span></span> </div>
        </div>
      </div>
      {result && result[0]["message"] === "SUCCESS" ? (
        <div className='estimations-container' style={{marginTop: "400px", width: "100vw", height: "100vh" }}>
          <span style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <span className='Title' style={{ marginLeft: "40px", fontSize: "50px", letterSpacing: '-3px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }} >
            Your skills are relevant to these roles
          </span>
          
          <span onMouseEnter={()=>(setClickInfoVisible(true))} onMouseLeave={()=>(setClickInfoVisible(false))} style={{display:"inline-block", position:"relative", marginTop:"0px",paddingTop:"10px",marginRight: "50px", fontSize: "50px", letterSpacing: '-3px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }}>
          <IoIosInformationCircleOutline />
          {ClickInfoVisible && (<div className='tooltip'>
            Click on the card to view more
          </div>)}
          </span>
          </span>
          <div className='estimations-grid' style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", transform: "scale(0.9)" }}>
            {result.map((key, x) => (
              <div className='item-body' onClick={() => handleKnowMore(x)} style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
                <div className='item-title-container'>
                  <span className="item-role">
                    {result[x].category}
                  </span>
                </div>
                <div stlye={{ display: "flex", flexDirection: "row" }}>
                  <span className="item-skill-score">
                    Skill score - {result[x]["Skill Score"]}%
                  </span>
                  <span className="item-skill-match">
                    Skill match - {result[x]["Skill Match"]}%
                  </span>
                </div>
                <span style={{ marginTop: "40px", fontSize: "20px", fontWeight: "450", color: "grey" }}>
                  Your salary estimation
                </span>
                <span className='item-salary-estimation'>
                  <span style={{ fontWeight: "550" }}> &#8377; 
                  {result[x].salary_estimate.every(salary => typeof salary === "number") // Check if all values are numbers
    ? (result[x].salary_estimate.map(salary => salary.toFixed(2)).join("L - ") + "L")
    :  (result[x].salary_estimate.map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
      )}
                      </span> / yr
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        result && <div>{result["message"]}</div>
      )
      }
      <div ref={salaryEstimateRef}>
        {knowMore && (
          <>
            <div className="estimation-container">
              <div className="text-content">
                <div className="body">
                  <span className="role">
                    {result[knowMoreIndex].category}
                  </span>
                  <div stlye={{ display: "flex", flexDirection: "row" }}>
                    <span className="skill-score">
                      Skill score - {result[knowMoreIndex]["Skill Score"]}%
                    </span>
                    <span className="skill-match">
                      Skill match - {result[knowMoreIndex]["Skill Match"]}%
                    </span>
                <span className="certification-match">
                Relevant Certificates - {Object.entries(result?.[knowMoreIndex]?.["certifications_relevance"] || {})
                  .filter(([_, isRelevant]) => isRelevant) // ✅ Only count relevant certifications
                  .length} {/* ✅ Display the count instead of the cert names */}
              </span>

                  </div>
                  {result[knowMoreIndex]['Experience'] &&
                  (
                    <>
       
                      <div className="exp">
                        Experience
                      </div>
                      <span className="certification-match" style={{display:"flex", flexDirection:"column", marginTop:"10px", overflow:"hidden",
      textOverflow: "ellipsis"}}>
                      {/* {Object.entries(result?.[knowMoreIndex]?.['Experience'] || {})
                        .filter(([_, isRelevant]) => isRelevant) // ✅ Only show relevant certifications
                        .map(([cert]) => (
                          <span key={cert}>{cert.split(":")[0]}</span> // ✅ Correct JSX syntax
                        ))} */}


{relevantExperiences.length > 0 ? (
  relevantExperiences.map(([cert]) => (
    <span key={cert} style={{  }}>{cert.split(":")[0]}</span>
  ))
) : (
  <span>No relevant experience</span>
)}

                    </span>
                   </>)}

                  <span style={{ marginTop: '30px' }}>
                    Base pay
                  </span>
                  <span className='base-pay'>
                    <span style={{ color: "green" }}> <span style={{ fontWeight: "550" }}> &#8377;
                       {/* {result[knowMoreIndex]["Base pay"].map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))}L */}
                       {result[knowMoreIndex]['Base pay'].every(salary => typeof salary === "number") // Check if all values are numbers
    ? (result[knowMoreIndex]['Base pay'].map(salary => salary.toFixed(2)).join("L - ") + "L")
    :  (result[knowMoreIndex]['Base pay'].map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
      )}
                       </span> </span> / yr
                  </span>
                  <span style={{ marginTop: "40px" }}>
                    Your salary estimation
                  </span>
                  <span className='salary-estimation'>
                    <span style={{ fontWeight: "550" }}> &#8377;
                    {result[knowMoreIndex].salary_estimate.every(salary => typeof salary === "number") // Check if all values are numbers
    ? (result[knowMoreIndex].salary_estimate.map(salary => salary.toFixed(2)).join("L - ") + "L")
    :  (result[knowMoreIndex].salary_estimate.map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
      )}
                        </span> / yr
                  </span>

                </div>
              </div>
              <div className='skills-body'>
              <div className='missing-body'>
                <span className='missingTitle'>Missing Required skills:</span>
                <div className='missingskillBox-Container'>
                  {result[knowMoreIndex]["missing_skills"].map((x,index) => (
                    <span className={`missingskillBox-${selectedSkills[index] ? "selected" : "unselected"}`}
                    onClick={() => toggleSkill(x, index)} key={index}>{x}</span>
                  ))}

                </div>
              </div>
              <div className='matching-body'>
              <span className='missingTitle'>Matching skills:</span>
              <div className='matchingskillBox-Container'>
                  {result[knowMoreIndex]["matching_skills"].map((x,index) => (
                    <span className='missingskillBox-unselected'  onClick={()=>removeSkill(x,index)} key={x}>{x}</span>
                  ))}

                </div>
              </div>
              <div className='btn-container' style={{marginLeft:"175px"}}>
                <button className='refresh-estimate-button' onClick={()=>handleRefresh()}>
                  {refreshLoading===true?
                                <div className='refreshing-loading-Container'>
                                <span style={{ fontSize: "40px", fontWeight: "550", color: "grey", letterSpacing: "-2px" }}>Refreshing</span>
                                <div className='refresh-loader'></div>
                              </div>
                 :<span>refresh</span>}

                  
                  </button>
                <button className='assess-estimate-button'>Assess your skills</button>

              </div>
              </div>
            </div>

          </>

        )
        }
      </div>

    </div >
  );
}

export default App;
