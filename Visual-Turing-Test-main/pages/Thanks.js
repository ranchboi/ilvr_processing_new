import { useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { HomeIcon } from "@heroicons/react/solid";
import { finalSurvState } from "../atoms/FinalSurvey";
import { useRecoilState } from "recoil";
// import submitSurvey from "./api/submitSurvey"; // Remove this import - it's causing the fs module error
import { useEffect, useRef } from "react";
import { atom, selector, useRecoilValue } from "recoil";
import LoadingBar from "react-top-loading-bar";

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

const Thanks = () => {
  const finalSu = useRecoilValue(finalSurvState);

  const [width, setWidth] = useState();

  const [height, setHeight] = useState();

  const [rem, setRem] = useState(true);

  const [finalRes, setFinalRes] = useRecoilState(finalSurvState);
  const [correct, setCorrect] = useState(null)

  // const [isLoading, setLoading] = useState(true);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // const ref = useRef(null);

  useEffect(() => {
    
    const fiR = localStorage.getItem("finalRes");
    const res = JSON.parse(fiR)
    console.log(res)
    setCorrect(res.FinalSurvey.reduce((acc, d) => {
       return acc + (answers[d.key] === d.choice ? 1 : 0)
     }, 0))
    
  }, []);

  // function submitSurvey(payload) {
  //   console.log("tete");
  //   fetch("/api/submitSurvey", {
  //     method: "POST",
  //     body: JSON.stringify(payload),
  //   })
  //     .then(() => {
  //       ref.current.complete();

  //       delay(600).then(() => setLoading(false));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // delay(100).then(() => setHeight(window?.innerWidth));
  // delay(100).then(() => setWidth(window?.innerHeight));

  delay(3000).then(() => setRem(false));

  return (
    <>
      <div>
        {rem && (
          <Confetti
            className="w-full"
            gravity={0.7}
            numberOfPieces={70}
            tweenDuration={2000}
          />
        )}
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 2 }}
          id="mainHeading"
          className="flex w-full min-h-screen"
        >
          <div className="mx-auto flex  flex-col justify-center text-center items-center max-w-7xl">
            <div className="font-ubuntu font-semibold text-[4.3rem]">
              Thank you!
            </div>

            <div className="font-ubuntu font-semibold text-[3rem]" style={{color: "#007f3a"}}>
              { `You got ${correct === null ? "__" : correct} out of 30 correct.` }
            </div>                

            <motion.a
              whileTap={{ scale: 0.9 }}
              href="/"
              //href={`${props.abouts[0].resume}?dl=`}
              className="flex mt-20 cursor-pointer justify-center rounded-[0.2rem] space-x-5 bg-darkBgLight py-4 font-ubuntu text-lg font-semibold text-white shadow-md shadow-gray-800 transition duration-500 ease-in-out lg:px-10 lg:hover:bg-gray-400 lg:hover:text-darkBgLight"
            >
              <HomeIcon className="h-7 w-7 animate-pulse hover:text-darkBgLight" />
              <p className="tracking-wider">Go To Home</p>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Thanks;
