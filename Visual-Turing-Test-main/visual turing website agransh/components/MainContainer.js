import Head from "next/head";
import Image from "next/image";
import TypeWriter from "typewriter-effect";
import { motion } from "framer-motion";
import { DownloadIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import { ArrowRightIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
const scaleVariants1 = {
  whileInView: {
    transform: "scale(0)",
    scale: [0, 1, 1.5, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      type: "spring",
      ease: "easeInOut",
      delay: 0.2,
    },
  },
};

const scaleVariants2 = {
  whileInView: {
    transform: "scale(0)",
    scale: [0, 1, 1.5, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      type: "spring",
      ease: "easeInOut",
      delay: 0.4,
    },
  },
};

const scaleVariants3 = {
  whileInView: {
    transform: "scale(0)",
    scale: [0, 1, 1.5, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      type: "spring",
      ease: "easeInOut",
      delay: 0.6,
    },
  },
};

const scaleVariants4 = {
  whileInView: {
    transform: "scale(0)",
    scale: [0, 1, 1.5, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      type: "spring",
      ease: "easeInOut",
      delay: 0.8,
    },
  },
};

const scaleVariants5 = {
  whileInView: {
    y: [100, 50, 0],
    opacity: [0, 0, 1],
    transition: { duration: 1 },
  },
};

const MainContainer = () => {
  var mainHeading = "Visual Turing Test";
  return (
    <div
      id="mainHeading"
      className="flex w-full items-center pt-20 pb-20 justify-center"
    >
      <div className="mx-auto flex flex-col items-center max-w-7xl">
        <div className="font-ubuntu mb-10 font-semibold text-[6.3rem]">
          <TypeWriter
            options={{
              delay: 25,
            }}
            onInit={(typewriter) => {
              typewriter.typeString(mainHeading).start();
            }}
          />
        </div>
        <motion.div
          variants={scaleVariants5}
          whileInView={scaleVariants5.whileInView}
          className="ml-9"
        >
          <div>
            <p className="tracking-wide w-[50rem] text-gray-800 text-lg lg:leading-8">
              In recent years, methods based on Artificial Intelligence (AI)
              have been increasingly employed to assist human radiologists in
              diagnosing patient images for pathologies, such as cancerous
              tumors or cardiac deficiencies. In this study we look into images
              obtained through medical scanning via X-ray Computed Tomography
              which produces cross sectional images of the body’s interior, such
              as the one shown below.
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <img
              className="h-[20rem] object-contain border-r-2"
              src="/soft.png"
            ></img>
          </div>
          <div className="mt-6">
            <p className="tracking-wide w-[50rem] text-gray-800 text-lg lg:leading-8">
              Just like human radiologists, AI-based methods also require
              training by letting it “see” a great diversity of human images and
              pathologies. And in order to make the AI as robust and effective
              as possible, an abundance of training images is needed -- the more
              images the better.
            </p>
          </div>
          <div className="mt-5">
            <p className="tracking-wide w-[50rem] text-gray-800 text-lg lg:leading-8">
              We have devised an algorithm which can generate synthetic images
              to boost the diversity of images that can be used for AI training,
              AI verification and AI testing. In the following we will show you
              a set of medical images, one at a time, and you will be asked
              whether you think they came from a human scan (real) or were
              generated from our algorithm (fake). If you think an image was
              algorithmically generated (fake) you will be asked how fake do you think the image is? 
              Is it Clearly Fake? Somewhat Real? or Almost Real?
            </p>
          </div>
          <div className="mt-5">
            <p className="tracking-wide w-[50rem] text-gray-800 text-lg lg:leading-8">
              Real and simulated images will be presented in random order, and
              you will be able to opt out at any time. No information will be
              collected that can link you to the responses you gave or that you
              participated in this study.
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={scaleVariants5}
          whileInView={scaleVariants5.whileInView}
          className="mt-9 ml-9"
        >
          <div className="mb-6">
            <p className="font-ubuntu text-2xl font-semibold tracking-wide underline ">
              Instructions
            </p>
          </div>
          <div className="mt-5">
            <p className="tracking-wide  w-[50rem] text-gray-800 text-lg lg:leading-8">
              The images below show typical CT window types (Soft Tissue, Bone, Lung) for context. 
              In the task you will see 15 scans in a set order; each scan has 8 slice images from one volume.
            </p>
          </div>
          <div className="flex flex-wrap space-x-4 justify-center mt-6">
            <img
              className="h-[11rem] object-contain border-r-2"
              src="/soft.png"
            ></img>
            <img
              className="h-[11rem] object-contain border-r-2"
              src="/bone.png"
            ></img>
            <img
              className="h-[11rem] object-contain border-r-2"
              src="/lung.png"
            ></img>
          </div>
          <div className="mt-6">
            <p className="tracking-wide  w-[50rem] text-gray-800 text-lg lg:leading-8">
              When you click "Proceed" you are assigned a radiologist ID (e.g. Radiologist A, B, C). 
              The task screen shows one image at a time with "Scan X of 15" and "Image X of 8" at the top. 
              Use the left/right arrows below the image to move through the 8 images in the current scan; 
              use "Previous 8" / "Next 8" to move between scans.
            </p>
          </div>
          <div className="mt-6">
            <p className="tracking-wide  w-[50rem] text-gray-800 text-lg lg:leading-8">
              For each scan, choose "Real" or "Fake" for the image shown. If you choose "Fake", pick how fake it looks 
              (Clearly Fake, Somewhat Real, or Almost Real). A pop-up will ask you to mark areas that look fake; 
              click "Submit Snippets" to confirm. You can move through all 8 images in a scan with the arrows before moving to the next scan.
            </p>
          </div>
          <div className="mt-6">
            <p className="tracking-wide  w-[50rem] text-gray-800 text-lg lg:leading-8">
              When you are done with the current scan, click "Next" to go to the next scan. On the last scan (Scan 15), 
              the button says "Submit". Click "Submit" to save your responses and finish; you will 
              be taken to a completion page. Click "Go to Home" there to do the study again.
            </p>
          </div>
          <div className="mt-5 text-center">
            <p className="tracking-wide font-bold  w-[50rem] text-red-800 text-md not-italic lg:leading-8">
              Note that you can always click the “Leave” button if you wish to
              exit the study prematurely. In this case the responses are not recorded.
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={scaleVariants5}
          whileInView={scaleVariants5.whileInView}
          className="flex flex-row lg:space-x-14 lg:space-y-0 space-y-5 justify-center mt-16"
        >
          <motion.a
            whileTap={{ scale: 0.9 }}
            href="#mainHeading"
            //href={`${props.abouts[0].resume}?dl=`}
            className="flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 bg-darkBgLight py-4 font-ubuntu text-lg font-semibold text-white shadow-md shadow-gray-800 transition duration-500 ease-in-out lg:px-10 lg:hover:bg-red-400 lg:hover:text-darkBgLight"
          >
            <p className="tracking-wider">Leave</p>
            <LogoutIcon className="h-7 w-7 animate-pulse hover:text-darkBgLight" />
          </motion.a>

          <motion.a
            href="/Classify"
            whileTap={{ scale: 0.9 }}
            className="flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 bg-gray-800 py-4 font-ubuntu text-lg font-semibold text-white shadow-md shadow-gray-800 transition duration-500 ease-in-out lg:px-8 lg:hover:bg-green-400 lg:hover:text-darkBgLight"
          >
            <p className="tracking-wider">Proceed</p>
            <ChevronDoubleRightIcon className="h-7 w-7 animate-pulse hover:text-darkBgLight" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default MainContainer;
