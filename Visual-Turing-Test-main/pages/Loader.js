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

const Loader = () => {
  const finalSu = useRecoilValue(finalSurvState);

  console.log("finals", finalSu);

  const [width, setWidth] = useState();

  const [height, setHeight] = useState();

  const [rem, setRem] = useState(true);

  const [num, setNum] = useState(false);

  const [finalRes, setFinalRes] = useRecoilState(finalSurvState);

  const [isLoading, setLoading] = useState(true);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const ref = useRef(null);

  useEffect(() => {
    ref.current.continuousStart();
    const fiR = localStorage.getItem("finalRes");
    submitSurveyToAPI(JSON.parse(fiR)); // Renamed function to avoid conflict
  }, []);

  function submitSurveyToAPI(payload) { // Renamed function
    console.log("tete");
    fetch("/api/submitSurvey", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then(() => {
        ref.current.complete();
        delay(300).then(() => location.href = "/Thanks");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  

  // delay(100).then(() => setHeight(window?.innerWidth));
  // delay(100).then(() => setWidth(window?.innerHeight));

  //delay(3000).then(() => setRem(false));

  return (
    <>
     
        <LoadingBar height={5} color="#33A7FF" ref={ref} />
      
    </>
  );
};

export default Loader;
