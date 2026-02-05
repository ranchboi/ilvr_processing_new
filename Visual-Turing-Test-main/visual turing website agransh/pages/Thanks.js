import { useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { HomeIcon } from "@heroicons/react/solid";

const Thanks = () => {
  const [rem, setRem] = useState(true);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

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

            <div className="flex gap-4 mt-20">
              <motion.a
                whileTap={{ scale: 0.9 }}
                href="/"
                //href={`${props.abouts[0].resume}?dl=`}
                className="flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 bg-darkBgLight py-4 font-ubuntu text-lg font-semibold text-white shadow-md shadow-gray-800 transition duration-500 ease-in-out lg:px-10 lg:hover:bg-gray-400 lg:hover:text-darkBgLight"
              >
                <HomeIcon className="h-7 w-7 animate-pulse hover:text-darkBgLight" />
                <p className="tracking-wider">Go To Home</p>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Thanks;
