import { useState, useEffect, useRef } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import Question from "../components/Question";
import { useRecoilState, useSetRecoilState } from "recoil";
import { resultState } from "../atoms/result";
import { finalSurvState } from "../atoms/FinalSurvey";;
// import { sanityClient, urlFor } from "../sanity";
import Question2 from "../components/Question2";
import Modal from "../components/Modal";
import AreaComponent from "../components/AreaComponent";
import { useRouter } from "next/router";
import { saveRadiologistResponse, getRadiologistResponses } from "../utils/storage";

// Scan configuration: 15 scans, 8 images each (PNG format)
// Order: 1 Real(w/o patho), 2 Real(w patho), 3 Real(w patho), 4–5 Gen, 6 Real(w patho), 7–11 Gen, 12 Real(w patho), 13 Gen, 14 Real(w patho), 15 Real(w/o patho)
const REAL_WO_PATHO = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"];
const GENERATED = ["3.png", "5.png", "7.png", "8.png", "11.png", "13.png", "14.png", "v7.png"];
// Real with patho: 8 slice divisions of the same volume per scan (30, 28, 36, 26, 18 = one volume each)
const REAL_WITH_PATHO_30 = ["30_0.png", "30_1.png", "30_2.png", "30_3.png", "30_4.png", "30_5.png", "30_6.png", "30_7.png"];
const REAL_WITH_PATHO_28 = ["28_0.png", "28_1.png", "28_2.png", "28_3.png", "28_4.png", "28_5.png", "28_6.png", "28_7.png"];
const REAL_WITH_PATHO_36 = ["36_0.png", "36_1.png", "36_2.png", "36_3.png", "36_4.png", "36_5.png", "36_6.png", "36_7.png"];
const REAL_WITH_PATHO_26 = ["26_0.png", "26_1.png", "26_2.png", "26_3.png", "26_4.png", "26_5.png", "26_6.png", "26_7.png"];
const REAL_WITH_PATHO_18 = ["18_0.png", "18_1.png", "18_2.png", "18_3.png", "18_4.png", "18_5.png", "18_6.png", "18_7.png"];

function makeScanImages(filenames, folder, scanIdx) {
  return filenames.map((f, i) => ({
    _id: scanIdx * 10 + i + 1,
    imageName: f,
    image: { asset: `/agransh_images/${folder}/${f}` },
  }));
}

// Build 15 scans with correct order and type
const SCAN_CONFIG = [
  { type: "Real_wo_patho", folder: "Real_wo_patho", files: REAL_WO_PATHO },                    // 1 Real (w/o patho) – 8 slices same volume
  { type: "Real_with_patho", folder: "Real_with_patho", files: REAL_WITH_PATHO_30 },           // 2 Real (with patho) – 8 slices from 30.npy
  { type: "Real_with_patho", folder: "Real_with_patho", files: REAL_WITH_PATHO_28 },           // 3 Real (with patho) – 8 slices from 28.npy
  { type: "Generated", folder: "Generated", files: GENERATED },                               // 4 Generated
  { type: "Generated", folder: "Generated", files: ["v8.png", "v11.png", "v12.png", "v14.png", "v16.png", "3.png", "5.png", "7.png"] }, // 5 Generated
  { type: "Real_with_patho", folder: "Real_with_patho", files: REAL_WITH_PATHO_36 },           // 6 Real (with patho) – 8 slices from 36.npy
  { type: "Generated", folder: "Generated", files: ["8.png", "11.png", "13.png", "14.png", "v7.png", "v8.png", "v11.png", "v12.png"] },   // 7 Generated
  { type: "Generated", folder: "Generated", files: ["v14.png", "v16.png", "3.png", "5.png", "7.png", "8.png", "11.png", "13.png"] },       // 8 Generated
  { type: "Generated", folder: "Generated", files: ["14.png", "v7.png", "v8.png", "v11.png", "v12.png", "v14.png", "v16.png", "3.png"] }, // 9 Generated
  { type: "Generated", folder: "Generated", files: ["5.png", "7.png", "8.png", "11.png", "13.png", "14.png", "v7.png", "v8.png"] },         // 10 Generated
  { type: "Generated", folder: "Generated", files: ["v11.png", "v12.png", "v14.png", "v16.png", "3.png", "5.png", "7.png", "8.png"] },     // 11 Generated
  { type: "Real_with_patho", folder: "Real_with_patho", files: REAL_WITH_PATHO_26 },           // 12 Real (with patho) – 8 slices from 26.npy
  { type: "Generated", folder: "Generated", files: ["11.png", "13.png", "14.png", "v7.png", "v8.png", "v11.png", "v12.png", "v14.png"] }, // 13 Generated
  { type: "Real_with_patho", folder: "Real_with_patho", files: REAL_WITH_PATHO_18 },           // 14 Real (with patho) – 8 slices from 18.npy
  { type: "Real_wo_patho", folder: "Real_wo_patho", files: REAL_WO_PATHO },                    // 15 Real (w/o patho) – 8 slices same volume
];

const imageGroups = SCAN_CONFIG.map((cfg, idx) =>
  makeScanImages(cfg.files, cfg.folder, idx + 1)
);

// Ground truth for scoring (exported for Thanks page)
const SCAN_ANSWERS = SCAN_CONFIG.map((c) => (c.type === "Generated" ? "Fake" : "Real"));

const Classify = (props) => {
  // let imagesArray = props?.ctImages[0].ctImagesGallery; // Commented out Sanity usage
  const router = useRouter();
  const [currentRadiologist, setCurrentRadiologist] = useState(null);

  const [openst, setOpenst] = useState(false);

  const [openArs, setOpenArs] = useState(false);

  const [areasA, setAreasA] = useState([]);

  const [snippetSubmitted, setSnippetSubmitted] = useState(false);

  const [last, setLast] = useState(false);
  const [currentIt, setCurrentIt] = useState(0);
  const [totalIm, setTotalIm] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState("");
  const [selectedE, setSelectedE] = useState("");
  const [fakeSel, setFakeSel] = useState(false);

  const [selectedF, setSelectedF] = useState("");

  const [images, setImages] = useState(imageGroups.flat());
  const [image, setImage] = useState(imageGroups[0]?.[0] || {});

  const [resSt, setResultSt] = useRecoilState(resultState);

  const [callbackSetup, setCallbackSetup] = useState(false);

  const [disable, setDisable] = useState(false); // Ensure this is false by default

  const [req, setReq] = useState(false);

  const stateRef = useRef();
  stateRef.current = resSt;

  const stateRef1 = useRef();
  stateRef1.current = currentIt;

  let setFinalRes = useSetRecoilState(finalSurvState);
  var hp = (currentIt / totalIm) * 100;

  let btnRef = useRef();

  const scaleVariants5 = {
    whileInView: {
      y: [100, 50, 0],
      opacity: [0, 0, 1],
      transition: { duration: 1 },
    },
  };

  useEffect(() => {
    if (fakeSel) {
      location.href = "#footer";
    }

    if (!fakeSel) {
      location.href = "#header";
    }
  }, [fakeSel]);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function Loader() {
    setSelected("");
    setSelectedF("");
    setFakeSel(false);
    setSnippetSubmitted(false)
    !isLoading && setIsLoading(true);
    delay(500).then(() => setIsLoading(false));
  }

  function setupConsoleCallback(callback) {
    //console.log("Setting up callback");
    setInterval(callback, 1000);
  }

  function updateLast() {
    //console.log("ul");
    setCurrentIt(totalIm + 1);
  }

  function handleChange(selectedIndex) {
    //console.log("s I :", selectedIndex);
    var newImageArray = images.filter(function (el, index) {
      return index + 1 == selectedIndex;
    });

    //console.log("newImageArray : ", newImageArray);

    let imP = newImageArray[0].image.asset;
    let imI = selectedIndex;
    let imN = newImageArray[0].imageName;


    var newImageArrayNext = images.filter(function (el, index) {
      return index + 1 == selectedIndex + 1;
    });

    setImage(newImageArrayNext[0]);

    var snippetCoordinates = JSON.parse(localStorage.getItem("snippetCoordinates"));

    //console.log('s-c : ', snippetCoordinates);



    for (let i = 0; i < snippetCoordinates?.length; i++) {
      snippetCoordinates[i] = Object.assign(snippetCoordinates[i], { _key: i + 1 });
    }

    //console.log('s-c : ', snippetCoordinates);

    let reJs = {
      key: imI,
      imageName: imN,
      image: {
        asset: imP,
      },
      choice: selected,
      reason: selectedF,
      snippetCoordinates: (selected == "Real" || !snippetSubmitted) ? [] : snippetCoordinates
    };

    setResultSt((resSt) => [...resSt, reJs]);
  }

  function handleSubmit(event) {
    // Validate last response before submitting
    const currentResponse = responses[currentGroupIndex];
    if (!currentResponse || !currentResponse.choice) {
      setReq(true);
      return;
    }
    if (currentResponse.choice === "Fake" && (!currentResponse.reason || !snippetSubmitted)) {
      setReq(true);
      return;
    }
    
    // Save final group response to localStorage (for API submission)
    saveCurrentGroupResponse();
    
    let d = new Date();
    let date = d.toString();
    if (!callbackSetup) {
      setupConsoleCallback(() => {
        const scanResponses = getRadiologistResponses(currentRadiologist);
        var finalJson = {
          Date: date,
          Knowledge: selectedE,
          FinalSurvey: stateRef.current,
          RadiologistId: currentRadiologist,
          scanResponses,
        };

        setFinalRes(finalJson);        
        localStorage.setItem("finalRes", JSON.stringify(finalJson));
        setCallbackSetup(true);
        delay(100).then(() => (location.href = "/Loader"));
      });
    }
  }

  function computeResult() {
    return resSt.reduce((acc, d) => {
      console.log(answers[d.key], d.choice, answers[d.key] === d.choice)      
      return acc + (answers[d.key] === d.choice ? 1 : 0)
    }, 0)
  }

  console.log("Final Array ", resSt);

  //console.log("la", last);

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // for slider within group
  const [responses, setResponses] = useState(Array(imageGroups.length).fill({}));

  // Assign radiologist on mount - each new visitor gets the next ID (A, B, C, ...)
  useEffect(() => {
    const storedRadiologist = sessionStorage.getItem('currentRadiologist');
    if (storedRadiologist) {
      setCurrentRadiologist(storedRadiologist);
      const savedResponses = getRadiologistResponses(storedRadiologist);
      if (savedResponses.length > 0) {
        const loadedResponses = Array(imageGroups.length).fill({});
        savedResponses.forEach((saved) => {
          const scanIndex = saved.scanNumber - 1;
          if (scanIndex >= 0 && scanIndex < imageGroups.length) {
            loadedResponses[scanIndex] = {
              choice: saved.choice || "",
              reason: saved.reason || "",
              fakeSel: saved.fakeSel || false,
            };
          }
        });
        setResponses(loadedResponses);
      }
    } else {
      // Assign next radiologist ID via API
      fetch('/api/next-radiologist', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error('Failed to assign radiologist:', data.error);
            setCurrentRadiologist('Unknown');
            return;
          }
          const radiologistId = data.radiologistId;
          sessionStorage.setItem('currentRadiologist', radiologistId);
          localStorage.setItem('currentRadiologist', radiologistId); // Also for storage utils
          setCurrentRadiologist(radiologistId);
        })
        .catch((err) => {
          console.error('Error assigning radiologist:', err);
          setCurrentRadiologist('Unknown');
        });
    }
  }, [router]);

  // Keyboard navigation for images within a group
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => Math.min(prev + 1, imageGroups[currentGroupIndex].length - 1));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGroupIndex, imageGroups]);

  function handleGroupResponse(response) {
    setResponses(prev => {
      const updated = [...prev];
      updated[currentGroupIndex] = { ...updated[currentGroupIndex], ...response };
      return updated;
    });
  }

  // Save current group response before navigating
  function saveCurrentGroupResponse() {
    if (!currentRadiologist) return;
    
    const currentResponse = responses[currentGroupIndex];
    if (currentResponse && (currentResponse.choice || Object.keys(currentResponse).length > 0)) {
      // Get snippet coordinates from localStorage
      const snippetCoordinates = JSON.parse(localStorage.getItem("snippetCoordinates") || "[]");
      
      // Get all images in current group
      const groupImages = imageGroups[currentGroupIndex].map(img => ({
        imageName: img.imageName,
        imagePath: img.image.asset,
        _id: img._id
      }));
      
      const responseData = {
        choice: currentResponse.choice || "",
        reason: currentResponse.reason || "",
        fakeSel: currentResponse.fakeSel || false,
        snippetCoordinates: (currentResponse.choice === "Fake" && snippetSubmitted) ? snippetCoordinates : [],
        images: groupImages,
        imageIndex: currentImageIndex,
        scanType: SCAN_CONFIG[currentGroupIndex]?.type || ""
      };
      
      saveRadiologistResponse(
        currentRadiologist,
        currentGroupIndex + 1, // Scan number (1-indexed)
        responseData
      );
    }
  }

  // Load response for a specific group
  function loadGroupResponse(groupIndex) {
    if (!currentRadiologist) return;
    const savedResponses = getRadiologistResponses(currentRadiologist);
    const savedResponse = savedResponses.find(r => r.scanNumber === groupIndex + 1);
    if (savedResponse && savedResponse.snippetCoordinates) {
      localStorage.setItem("snippetCoordinates", JSON.stringify(savedResponse.snippetCoordinates));
      setAreasA(savedResponse.snippetCoordinates);
      setSnippetSubmitted(savedResponse.snippetCoordinates.length > 0);
    } else {
      setAreasA([]);
      setSnippetSubmitted(false);
      localStorage.removeItem("snippetCoordinates");
    }
  }

  // Navigation between groups
  function goToPrevGroup() {
    saveCurrentGroupResponse();
    const newIndex = Math.max(currentGroupIndex - 1, 0);
    setCurrentGroupIndex(newIndex);
    setCurrentImageIndex(0);
    loadGroupResponse(newIndex);
    setReq(false);
  }
  function goToNextGroup() {
    // Validate current response before proceeding
    const currentResponse = responses[currentGroupIndex];
    if (!currentResponse || !currentResponse.choice) {
      setReq(true);
      return;
    }
    if (currentResponse.choice === "Fake" && (!currentResponse.reason || !snippetSubmitted)) {
      setReq(true);
      return;
    }
    
    saveCurrentGroupResponse();
    const newIndex = Math.min(currentGroupIndex + 1, imageGroups.length - 1);
    setCurrentGroupIndex(newIndex);
    setCurrentImageIndex(0);
    loadGroupResponse(newIndex);
    setReq(false);
  }

  // Show loading if radiologist not set
  if (!currentRadiologist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl mt-4 mb-2 px-4">
        <div className="text-right text-sm text-gray-600">
          Current Radiologist: <span className="font-semibold">{currentRadiologist?.startsWith('Radiologist ') ? currentRadiologist : `Radiologist ${currentRadiologist}`}</span>
        </div>
      </div>
      <div className="flex flex-row w-full max-w-5xl mt-2 mb-4">
        {/* Left: Image with arrows below */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            className="h-[29rem] object-contain border-r-4 mx-4"
            src={imageGroups[currentGroupIndex][currentImageIndex].image.asset}
            alt={imageGroups[currentGroupIndex][currentImageIndex].imageName}
          />
          <div className="flex flex-row justify-center mt-4">
            <button
              onClick={() => setCurrentImageIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentImageIndex === 0}
              className="px-2 text-3xl h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full mr-2"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => Math.min(prev + 1, imageGroups[currentGroupIndex].length - 1))}
              disabled={currentImageIndex === imageGroups[currentGroupIndex].length - 1}
              className="px-2 text-3xl h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full ml-2"
              aria-label="Next image"
            >
              &#8594;
            </button>
          </div>
        </div>
        {/* Right: Controls */}
        <div className="flex flex-col flex-1 justify-start items-center space-y-4">
          {/* Navigation */}
          <div className="flex justify-between items-center w-full max-w-xs">
            <button onClick={goToPrevGroup} disabled={currentGroupIndex === 0} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Previous 8</button>
            <span>Scan {currentGroupIndex + 1} of {imageGroups.length}</span>
            <button onClick={goToNextGroup} disabled={currentGroupIndex === imageGroups.length - 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Next 8</button>
          </div>
          {/* Image number in the series */}
          <div className="text-center w-full max-w-xs text-gray-700 font-semibold">
            Image {currentImageIndex + 1} of {imageGroups[currentGroupIndex].length}
          </div>
          {/* Question */}
          <div className="w-full max-w-xs flex justify-center">
            <Question
              load={false}
              selectedSet={val => handleGroupResponse({ choice: val })}
              fakeSelSet={val => handleGroupResponse({ fakeSel: val })}
              selectedI={responses[currentGroupIndex]?.choice || ""}
              fakeSelI={responses[currentGroupIndex]?.fakeSel || false}
              selectedFI={responses[currentGroupIndex]?.reason || ""}
              setSelectedFI={val => handleGroupResponse({ reason: val })}
              reqI={req}
              setOpenAQ={setOpenArs}
              areas={areasA}
              setAreas={setAreasA}
            />
          </div>
          {/* AreaComponent */}
          <div className="w-full max-w-xs flex justify-center">
            <AreaComponent
              areas={areasA}
              setAreas={setAreasA}
              setSnippetSubmittedA={setSnippetSubmitted}
              img={imageGroups[currentGroupIndex][0]}
              setOpenAr={setOpenArs}
              openAr={openArs}
            />
          </div>
          {/* Footer */}
          <div className="w-full flex justify-center">
            {currentGroupIndex < imageGroups.length - 1 ? (
              <motion.button
                onClick={goToNextGroup}
                disabled={disable}
                whileTap={{ scale: 0.9 }}
                style={{maxWidth: '12rem', marginLeft: 0}}
                className={"mt-4 flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 transition duration-500 ease-in-out lg:px-8 py-4 font-ubuntu text-lg font-semibold shadow-md text-white bg-gray-800  shadow-gray-800  lg:hover:bg-green-400 lg:hover:text-darkBgLight"}
              >
                <p className="tracking-wider">Next</p>
                <PaperAirplaneIcon className="h-7 w-7 animate-pulse rotate-90" />
              </motion.button>
            ) : (
              <motion.button
                id="submit"
                ref={btnRef}
                disabled={disable}
                onClick={handleSubmit}
                whileTap={{ scale: 0.9 }}
                style={{maxWidth: '12rem', marginLeft: 0}}
                className={"mt-4 flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 transition duration-500 ease-in-out lg:px-8 py-4 font-ubuntu text-lg font-semibold shadow-md text-white bg-gray-800  shadow-gray-800  lg:hover:bg-green-400 lg:hover:text-darkBgLight"}
              >
                <p className="tracking-wider">Get Results</p>
                <CheckCircleIcon className="h-7 w-7 animate-pulse " />
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <Modal open={openst} setOpen={setOpenst} />
    </div>
  );
};

// export const getServerSideProps = async () => {
//   const ctImageQuery = `*[_type=="images"]{
//    _id,
//    _createdAt,
//    ctImagesGallery
//  }`;
//
//   const ctImageData = await sanityClient.fetch(ctImageQuery);
//   return {
//     props: {
//       ctImages: ctImageData,
//     },
//   };
// };

export default Classify;
