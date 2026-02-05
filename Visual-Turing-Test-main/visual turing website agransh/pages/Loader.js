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
    ref.current?.continuousStart();
    const fiR = localStorage.getItem("finalRes");
    const payload = fiR ? JSON.parse(fiR) : null;
    submitSurveyToAPI(payload);
  }, []);

  function submitSurveyToAPI(payload) {
    if (!payload) {
      ref.current?.complete();
      delay(300).then(() => location.href = "/Thanks");
      return;
    }
    // Add correctness to each scan (stored in DB, not shown to user)
    const SCAN_ANSWERS = ["Real", "Real", "Real", "Fake", "Fake", "Real", "Fake", "Fake", "Fake", "Fake", "Fake", "Real", "Fake", "Real", "Real"];
    const scanResponses = (payload.scanResponses || []).map((scan) => {
      const idx = (scan.scanNumber || 0) - 1;
      const correct = idx >= 0 && idx < SCAN_ANSWERS.length && SCAN_ANSWERS[idx] === scan.choice;
      return { ...scan, correct };
    });
    const totalCorrect = scanResponses.filter((s) => s.correct).length;
    fetch("/api/submit-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        radiologistId: payload.RadiologistId,
        scanResponses,
        totalCorrect,
        totalScans: scanResponses.length,
        finalSurvey: payload.FinalSurvey,
        knowledge: payload.Knowledge,
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        ref.current?.complete();
        if (!ok) {
          const errMsg = data?.error || "Unknown error";
          let hint = data?.hint;
          if (!hint) {
            hint = errMsg.includes("not configured")
              ? "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel: Project → Settings → Environment Variables. Redeploy after saving."
              : "Check the table name is 'responses' and has columns: id, radiologist_id, responses (jsonb), total_correct, total_scans, final_survey (jsonb), knowledge, created_at.";
          }
          const detail = data?.detail ? "\n" + data.detail : "";
          alert("Could not save to database: " + errMsg + detail + "\n\n" + hint);
          delay(300).then(() => location.href = "/Thanks");
          return;
        }
        if (data.savedTo === "local") {
          alert("Response saved to a local file only.\n\nTo save to Supabase Table Editor, add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.local file in the 'visual turing website agransh' folder, then restart the dev server.");
        }
        delay(300).then(() => location.href = "/Thanks");
      })
      .catch((err) => {
        console.error(err);
        ref.current?.complete();
        alert("Submit failed: " + (err?.message || "Network or server error") + ". Check the browser console and server logs.");
        delay(300).then(() => location.href = "/Thanks");
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
