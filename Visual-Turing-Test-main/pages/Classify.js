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

// Utility to chunk images into groups of 8
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const answers = {
  1: "Fake",
  2: "Real",
  3: "Fake",
  4: "Real",
  5: "Real",
  6: "Fake",
  7: "Fake",
  8: "Real",
  9: "Real",
  10: "Real",
  11: "Real",
  12: "Real",
  13: "Fake",
  14: "Fake",
  15: "Real",
  16: "Real",
  17: "Fake",
  18: "Fake",
  19: "Fake",
  20: "Real",
  21: "Fake",
  22: "Fake",
  23: "Real",
  24: "Fake",
  25: "Real",
  26: "Real",
  27: "Fake",
  28: "Fake",
  29: "Real",
  30: "Fake"
}

// Example: List of local image filenames in vtt_soft
const localImageFilenames = [
  "1.png",
  "2.png",
  "3.png",  
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "111221_0_196_1-097.png", 
  "101837_0_114_1-038.png",
  "103703_0_252_1-170.png",
  "104363_0_135_1-047.png",
  "01238.png",
  "00156.png",
  "00173.png",
  "00187.png",
  "00107.png",
  "00132.png",
  "00136.png",
  "00140.png",
  "00024.png",
  "00025.png",
  "00031.png",
  "00033.png",
  "00045.png",
  "00046.png",
  "00048.png",
  "00049.png",
  "00057.png",
  "00002.png",
  "00006.png",
  "00009.png",
  "00011.png",
  "00013.png",
  "00015.png",
  "00019.png"
];

const imagesArray = localImageFilenames.map((filename, idx) => ({
  _id: idx + 1,
  imageName: filename,
  image: {
    asset: `/vtt_soft/${filename}`
  }
}));

const imagesPerGroup = 8;
const imageGroups = chunkArray(imagesArray, imagesPerGroup);

const Classify = (props) => {
  // let imagesArray = props?.ctImages[0].ctImagesGallery; // Commented out Sanity usage

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

  const [images, setImages] = useState(imagesArray);

  const [image, setImage] = useState(imagesArray[0]);

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
    //console.log("asas");
    let d = new Date();
    let date = d.toString();
    if (!callbackSetup) {
      setupConsoleCallback(() => {
        var finalJson = {
          Date: date,
          Knowledge: selectedE,
          FinalSurvey: stateRef.current,
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
  // Per-group, per-image: responses[groupIndex][imageIndex] = { choice, fakeSel, reason }; default choice = "Real"
  const [responses, setResponses] = useState(() =>
    imageGroups.map((group) =>
      Array.from({ length: group.length }, () => ({ choice: "Real", fakeSel: false }))
    )
  );

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
      const updated = prev.map((group, g) =>
        g === currentGroupIndex
          ? group.map((slot, i) =>
              i === currentImageIndex ? { ...slot, ...response } : slot
            )
          : group
      );
      return updated;
    });
  }

  // Navigation between groups
  function goToPrevGroup() {
    setCurrentGroupIndex((prev) => Math.max(prev - 1, 0));
    setCurrentImageIndex(0);
  }
  function goToNextGroup() {
    setCurrentGroupIndex((prev) => Math.min(prev + 1, imageGroups.length - 1));
    setCurrentImageIndex(0);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="flex flex-row w-full max-w-5xl mt-8 mb-4">
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
              selectedI={responses[currentGroupIndex]?.[currentImageIndex]?.choice === "Fake" ? "Fake" : "Real"}
              fakeSelI={responses[currentGroupIndex]?.[currentImageIndex]?.fakeSel ?? false}
              selectedFI={responses[currentGroupIndex]?.[currentImageIndex]?.reason ?? ""}
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
