import logo from './logo.svg';
import { motion } from 'framer-motion';
import {  useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import { FaDollarSign } from 'react-icons/fa';
import Category from './components/Category/Category';
import ExperienceCategory from './components/ExperienceCategory/ExperienceCategory';
import "@fontsource/bebas-neue"; // Defaults to weight 400
import { IoIosInformationCircleOutline } from "react-icons/io";
import DragNdrop from './components/dragdrop';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [file, setfile] = useState();
  const [Skill, ] = useState("");
  const [Skills, setSkills] = useState([])
  const [result, setResult] = useState(null);

  const [certifcates, setCertificates] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)



  const [Experience, setExperience] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEXPCategory, setSelectedEXPCategory] = useState("");

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


// const handleRefresh = async () => {
//   if (!Array.isArray(Skills)) {
//     console.error("Skills should be an array.");
//     return;
//   }
//   try {
//     const category_list = result.length > 0 ? result[0]['category_list'] : [];
//     console.log('category_list:',category_list)
//     setRefreshLoading(true)
//     const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/refresh", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ Skills, selectedCategory, category_list, selectedEXPCategory }), // Pass skills directly
//     });
//     const data = await response.json();
    
//     console.log('refresh successful,',data)
//     console.log('result', result)
//     try{
//     for (let i = 0; i < result.length; i++) {
//       if (result[i]['category'] === data[i]['category']) {
//           // Copy all fields from data[i] to result[i], except category
//           Object.keys(data[i]).forEach(key => {
//               if (key !== 'category') {
//                   result[i][key] = data[i][key];
//               }
//           });
//       }
//   }
// }catch(e){
//   console.log(e)
// }
    
//     setSelectedSkills({})
//     setRefreshLoading(false)


//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };



  const handleSearch = async () => {
    if (
      !Array.isArray(Skills) || Skills.length === 0 ||
      !Experience || 
      !selectedCategory
    ) {
      alert("Invalid input: Ensure Skills, certificates, Experience, and selectedCategory are properly set.");
      return;
    }

    try {
      setResultsLoading(true)
      const response = await fetch("https://salary-predictor-backend-x7ej.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Skills, certifcates, Experience, selectedCategory, selectedEXPCategory }), // Pass skills directly
      });

      const data = await response.json();
      setResult(data);
      console.log(data)
      setResultsLoading(false)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  
  const [masterSkillList, setmasterSkillLiSt] = useState([]);
  const [, setSuggestions] = useState([]);



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

      const response = await axios.post("https://salary-predictor-backend-bp2j.onrender.com/upload", formData, {
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





 



  // const handleKnowMore = (x) => {
  //   setKnowMore(true)
  //   setKnowMoreIndex(x)
  //   setrelevantExperiences(Object.entries(result?.[x]?.['Experience'] || {}).filter(([_, isRelevant]) => isRelevant));
  //   setSelectedSkills({})
  // }

 


 

  // Function to toggle skill selection
  // const toggleSkill = (skill, index) => {
  //   setSelectedSkills((prev) => ({
  //     ...prev,
  //     [index]: !prev[index], // Toggle selected state for the clicked index
  //   }));
  //   setSkills([...Skills, skill])
  // };

  const removeSkill = (skill, index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };



  
 

  return (
//     <div className="App">
//       <div className='input-container'>
//         <div className='title-container'>
//           <div className='Title' style={{  fontFamily: 'Bebas Neue, sans-serif', fontSize: "80px", letterSpacing: '-1px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }}>
//             Salary Predictor
//           </div>
//         </div>
//         <div className='main-body'>
//           <div className='skill-input'>
//           <div className="p-4">
//             <Category onCategorySelect={handleCategoryChange} />
//             {/* {selectedCategory && <p>Selected: {selectedCategory}</p>} */}
//         </div>
//         <div className="p-4">
//             <ExperienceCategory onEXPCategorySelect={handleEXPCategoryChange} />
//             {/* {selectedCategory && <p>Selected: {selectedCategory}</p>} */}
//         </div>
//             {/* <div className='manual-skillInput'>
//               <span className='manualTitle'>Manual Skill Input :</span>

//               <input type='text' className='inputbox' value={Skill} placeholder='Enter your skill' onKeyDown={handleKeyDown} onChange={(e) => setSkill(e.target.value)} />
//               <IoIosSearch
//                 style={{
//                   position: "absolute",
//                   right: "72px",
//                   top: "61%",
//                   transform: "translateY(-50%)",
//                   fontSize: "40px",
//                   color: "gray",
//                   cursor: "pointer",
//                   zIndex: "1000",

//                 }}
//                 onClick={handleSearch}
//               />
//             </div>

//             <div>
//               {suggestions.length > 0 && (
//                 // <div className='Suggestionbox'>
//                 //   {suggestions.map((college) => (
//                 //     <div
//                 //       key={college}
//                 //       onClick={() => {
//                 //         setSkill(college);
//                 //         setSuggestions([]);
//                 //       }}
//                 //       style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ccc", borderRadius: "10px", borderLeft: "0px", borderRight: "0px" }}
//                 //     >
//                 //       {college}
//                 //     </div>
//                 //   ))}
//                 // </div>
//                 <div className="Suggestionbox">
//                 {suggestions.map((college, index) => (
//                   <div
//                     key={college}
//                     onClick={() => {
//                       setSkill(college);
//                       setSuggestions([]);
//                     }}
//                     style={{
//                       padding: "8px",
//                       cursor: "pointer",
//                       borderBottom: "1px solid #ccc",
//                       borderRadius: "10px",
//                       backgroundColor: index === activeIndex ? "#f0f0f0" : "white",
//                     }}
//                   >
//                     {college}
//                   </div>
//                       ))}
//                 </div>
//               )}
//             </div> */}
//             <div className='upload-container'>
//               <span className='resumeTitle' >Resume Input :</span>
//               <DragNdrop onFilesSelected={handleFilesSelected} width="450px" height="200px" />
//             </div>
//           </div>
//           <div style={{display:'flex',flexDirection:'column'}}>
//             {/* <div className='select-experience'>
//             <span className='extractedTitle'>
//             <span>Experience Category :</span>
//             </span>
//             <input type='text' className='inputbox' value={Skill} placeholder='Search category...' onKeyDown={handleKeyDown} onChange={(e) => setSkill(e.target.value)} />
              
//             </div> */}
//           <div className='extracted-body'>
//             <span className='extractedTitle'>
//               <span>Your skills:</span>
//               <span
//               className="info-wrapper"
//       onMouseEnter={() => setinfoVisible(true)}
//       onMouseLeave={() => setinfoVisible(false)}
//     >
//                     <IoIosInformationCircleOutline />

//       {infovisible && (
//         <div className="tooltip">
//           You can remove skills by clicking on them
//         </div>
//       )}
//     </span>

//               </span>
//             {skillsLoading === true && (
//               <div className='loading-Container'>
//                 <span style={{ fontSize: "40px", fontWeight: "550", color: "grey", letterSpacing: "-2px" }}>Loading</span>
//                 <div ><span className="loader"></span></div>
//               </div>
//             )}

//             <div className='skillBox-Container'>

//               {/* {Skills?.map((x) => (
//                 <>
//                   <span className='skillBox' key={x}>{x}</span>
//                 </>
//               ))} */}
//               {Array.isArray(Skills) ? (
//     Skills.map((x,index) => (
//       <span className='skillBox' onClick={()=>removeSkill(x,index)} key={index}>{x}</span>
//     ))
//   ) : (
//     <p style={{ color: 'red' }}>Something went wrong. Unable to load skills. Please try again.</p>
//   )}
//             </div>

//           </div>
//         </div>
//         </div>
//         <div className='btn-container'>
//           <button className='salary-estimate-button' onClick={handleSearch}>

//             {resultsLoading === false ? (
//               <span> estimate</span>)
//               : (<div className='results-container'>
//                 <div className='results-loader'>
//                 </div>
//               </div>)
//             }


//           </button>

//           <div className='certifications-body'><span className='certificationTitle'>Number of Certifications:<span style={{ marginLeft: "20px", fontSize: "40px", fontWeight: "450", color: "grey" }}>{certifcates.length}</span></span> </div>
//         </div>
//       </div>
//       {result && result[0]["message"] === "SUCCESS" ? (
//         <div className='estimations-container' style={{marginTop: "400px", width: "100vw", height: "100vh" }}>
//           <span style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
//           <span className='Title' style={{ marginLeft: "40px", fontSize: "50px", letterSpacing: '-3px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }} >
//             Your skills are relevant to these roles
//           </span>
          
//           <span onMouseEnter={()=>(setClickInfoVisible(true))} onMouseLeave={()=>(setClickInfoVisible(false))} style={{display:"inline-block", position:"relative", marginTop:"0px",paddingTop:"10px",marginRight: "50px", fontSize: "50px", letterSpacing: '-3px', fontWeight: '550', color: 'rgba(0,0,0,0.8)' }}>
//           <IoIosInformationCircleOutline />
//           {ClickInfoVisible && (<div className='tooltip'>
//             Click on the card to view more
//           </div>)}
//           </span>
//           </span>
//           <div className='estimations-grid' style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", transform: "scale(0.9)" }}>
//             {result.map((key, x) => (
//               <div className='item-body' onClick={() => handleKnowMore(x)} style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
//                 <div className='item-title-container'>
//                   <span className="item-role">
//                     {result[x].category}
//                   </span>
//                 </div>
//                 <div stlye={{ display: "flex", flexDirection: "row" }}>
//                   <span className="item-skill-score">
//                     Skill score - {result[x]["Skill Score"]}%
//                   </span>
//                   <span className="item-skill-match">
//                     Skill match - {result[x]["Skill Match"]}%
//                   </span>
//                 </div>
//                 <span style={{ marginTop: "40px", fontSize: "20px", fontWeight: "450", color: "grey" }}>
//                   Your salary estimation
//                 </span>
//                 <span className='item-salary-estimation'>
//                   <span style={{ fontWeight: "550" }}> &#8377; 
//                   {result[x].salary_estimate.every(salary => typeof salary === "number") // Check if all values are numbers
//     ? (result[x].salary_estimate.map(salary => salary.toFixed(2)).join("L - ") + "L")
//     :  (result[x].salary_estimate.map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
//       )}
//                       </span> / yr
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         result && <div>{result["message"]}</div>
//       )
//       }
//       <div ref={salaryEstimateRef}>
//         {knowMore && (
//           <>
//             <div className="estimation-container">
//               <div className="text-content">
//                 <div className="body">
//                   <span className="role">
//                     {result[knowMoreIndex].category}
//                   </span>
//                   <div stlye={{ display: "flex", flexDirection: "row" }}>
//                     <span className="skill-score">
//                       Skill score - {result[knowMoreIndex]["Skill Score"]}%
//                     </span>
//                     <span className="skill-match">
//                       Skill match - {result[knowMoreIndex]["Skill Match"]}%
//                     </span>
//                 <span className="certification-match">
//                 Relevant Certificates - {Object.entries(result?.[knowMoreIndex]?.["certifications_relevance"] || {})
//                   .filter(([_, isRelevant]) => isRelevant) // ✅ Only count relevant certifications
//                   .length} {/* ✅ Display the count instead of the cert names */}
//               </span>

//                   </div>
//                   {result[knowMoreIndex]['Experience'] &&
//                   (
//                     <>
       
//                       <div className="exp">
//                         Experience
//                       </div>
//                       <span className="certification-match" style={{display:"flex", flexDirection:"column", marginTop:"10px", overflow:"hidden",
//       textOverflow: "ellipsis"}}>
//                       {/* {Object.entries(result?.[knowMoreIndex]?.['Experience'] || {})
//                         .filter(([_, isRelevant]) => isRelevant) // ✅ Only show relevant certifications
//                         .map(([cert]) => (
//                           <span key={cert}>{cert.split(":")[0]}</span> // ✅ Correct JSX syntax
//                         ))} */}


// {relevantExperiences.length > 0 ? (
//   relevantExperiences.map(([cert]) => (
//     <span key={cert} style={{  }}>{cert.split(":")[0]}</span>
//   ))
// ) : (
//   <span>No relevant experience</span>
// )}

//                     </span>
//                    </>)}

//                   <span style={{ marginTop: '30px' }}>
//                     Base pay
//                   </span>
//                   <span className='base-pay'>
//                     <span style={{ color: "green" }}> <span style={{ fontWeight: "550" }}> &#8377;
//                        {/* {result[knowMoreIndex]["Base pay"].map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))}L */}
//                        {result[knowMoreIndex]['Base pay'].every(salary => typeof salary === "number") // Check if all values are numbers
//     ? (result[knowMoreIndex]['Base pay'].map(salary => salary.toFixed(2)).join("L - ") + "L")
//     :  (result[knowMoreIndex]['Base pay'].map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
//       )}
//                        </span> </span> / yr
//                   </span>
//                   <span style={{ marginTop: "40px" }}>
//                     Your salary estimation
//                   </span>
//                   <span className='salary-estimation'>
//                     <span style={{ fontWeight: "550" }}> &#8377;
//                     {result[knowMoreIndex].salary_estimate.every(salary => typeof salary === "number") // Check if all values are numbers
//     ? (result[knowMoreIndex].salary_estimate.map(salary => salary.toFixed(2)).join("L - ") + "L")
//     :  (result[knowMoreIndex].salary_estimate.map(salary => (typeof salary === "number" ? salary.toFixed(2) : salary))  // Only apply toFixed(2) if it's a number
//       )}
//                         </span> / yr
//                   </span>

//                 </div>
//               </div>
//               <div className='skills-body'>
//               <div className='missing-body'>
//                 <span className='missingTitle'>Missing Required skills:</span>
//                 <div className='missingskillBox-Container'>
//                   {result[knowMoreIndex]["missing_skills"].map((x,index) => (
//                     <span className={`missingskillBox-${selectedSkills[index] ? "selected" : "unselected"}`}
//                     onClick={() => toggleSkill(x, index)} key={index}>{x}</span>
//                   ))}

//                 </div>
//               </div>
//               <div className='matching-body'>
//               <span className='missingTitle'>Matching skills:</span>
//               <div className='matchingskillBox-Container'>
//                   {result[knowMoreIndex]["matching_skills"].map((x,index) => (
//                     <span className='missingskillBox-unselected'  onClick={()=>removeSkill(x,index)} key={x}>{x}</span>
//                   ))}

//                 </div>
//               </div>
//               <div className='btn-container' style={{marginLeft:"175px"}}>
//                 <button className='refresh-estimate-button' onClick={()=>handleRefresh()}>
//                   {refreshLoading===true?
//                                 <div className='refreshing-loading-Container'>
//                                 <span style={{ fontSize: "40px", fontWeight: "550", color: "grey", letterSpacing: "-2px" }}>Refreshing</span>
//                                 <div className='refresh-loader'></div>
//                               </div>
//                  :<span>refresh</span>}

                  
//                   </button>
//                 <button className='assess-estimate-button'>Assess your skills</button>

//               </div>
//               </div>
//             </div>

//           </>

//         )
//         }
//       </div>

//     </div >
         <div className="relative min-h-screen bg-gradient-to-br font-inter overflow-hidden">
      {/* Background animation */}
       <motion.div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      >
        {/* Blush-style radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(253,186,255,0.08)_0%,transparent_60%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(204,180,255,0.07)_0%,transparent_60%)] animate-pulse delay-300" />

        {/* Floating dollar icons on the left only */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute text-4xl text-purple-600 animate-float`} 
            style={{
              top: `${10 + i * 15}%`,
              left: `${5 + i * 1.5}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <FaDollarSign />
          </motion.div>
        ))}

        {/* Flowing animated SVG lines */}
        <svg className="absolute w-full h-full top-0 left-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M-1000 50 Q-800 150 -600 50 T-200 50 T200 50 T600 50 T1000 50"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            fill="none"
          >
            <animate
              attributeName="d"
              values="M-1000 50 Q-800 150 -600 50 T-200 50 T200 50 T600 50 T1000 50;
                      M-1000 60 Q-800 140 -600 60 T-200 60 T200 60 T600 60 T1000 60;
                      M-1000 50 Q-800 150 -600 50 T-200 50 T200 50 T600 50 T1000 50"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Custom animation keyframe (add to global CSS) */}
        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(-20px); opacity: 1; }
              100% { transform: translateY(0); opacity: 0.5; }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `}
        </style>
      </motion.div>

      {/* Navbar */}
      <nav className="relative z-10 w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200">
        <img src={logo} alt="Coursevita Logo" className="h-8 w-auto" />
        <span className="text-sm text-gray-500">AI-Powered Career Tools</span>
      </nav>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-purple-900 font-bebas tracking-tight">Salary Predictor</h1>
          <p className="text-gray-700 mt-2 text-lg">Upload your resume and let AI estimate your expected salary.</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-10 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
              <label className="text-base font-medium text-gray-600">Category:</label>
              <div className="w-2/3">
                <Category onCategorySelect={handleCategoryChange} />
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
              <label className="text-base font-medium text-gray-600">Experience:</label>
              <div className="w-2/3">
                <ExperienceCategory onEXPCategorySelect={handleEXPCategoryChange} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-base font-semibold text-purple-800 mb-2">Resume Input:</h2>
              <DragNdrop onFilesSelected={handleFilesSelected} width="100%" height="180px" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200 min-h-[360px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-purple-800">Your Skills</h2>
              <IoIosInformationCircleOutline className="text-gray-500 text-2xl cursor-pointer hover:text-purple-700" />
            </div>
            {skillsLoading ? (
              <div className="text-center text-gray-600 text-base">Loading skills...</div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {Array.isArray(Skills) && Skills.length > 0 ? (
                  Skills.map((x, index) => (
                    <span
                      key={index}
                      onClick={() => removeSkill(x, index)}
                      className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-sm text-purple-800 hover:bg-purple-100 cursor-pointer transition"
                    >
                      {x}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No skills extracted. Please upload a valid resume.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-14 max-w-7xl mx-auto text-center">
          <button
            className="w-full lg:w-[300px] bg-purple-700 hover:bg-purple-800 text-white text-lg font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
            onClick={handleSearch}
          >
            {resultsLoading ? (
              <span className="flex items-center justify-center gap-2">Estimating... <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span></span>
            ) : (
              "Estimate Salary"
            )}
          </button>

          <div className="text-lg font-medium text-gray-800">
            Number of Certifications: <span className="text-purple-900 font-bold">{certifcates.length}</span>
          </div>

          {result && result.length > 0 && result[0].message === "SUCCESS" && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
              >
                {result.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition"
                  >
                    <div className="p-5 text-left">

                      <h3 className="text-lg font-bold text-gray-800 mt-1 mb-3">{item.category}</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li><span className="inline-block w-4">📚</span> Skill Match: {item["Skill Match"]}%</li>
                        <li><span className="inline-block w-4">🧠</span> Skill Score: {item["Skill Score"]}%</li>
                      </ul>
                      <p className="mt-4 text-sm text-gray-800 font-medium">
                        Estimated Salary:
                        <span className="block text-xl text-purple-800 font-semibold">
                          ₹{item.salary_estimate.filter(x => typeof x === 'number').map(x => x.toFixed(2)).join('L - ')}L / year
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <div className="w-full mt-12 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-4 text-left">Role-wise Salary Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={result.map(r => ({ name: r.category, salary: r.salary_estimate[1] }))}>
                    <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="salary" fill="#9333ea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
