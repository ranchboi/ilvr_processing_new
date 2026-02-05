import { AreaSelector, IArea } from "@bmunozg/react-image-area";
// import { sanityClient, urlFor } from "../sanity";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
// import $ from "jquery";
import {
  ViewGridAddIcon,
  ViewListIcon,
  VideoCameraIcon,
} from "@heroicons/react/solid";

export default function AreaComponent({
  openAr,
  setOpenAr,
  img,
  areas,
  setAreas,
  setSnippetSubmittedA,
}) {
  //   const [areas, setAreas] = useState([]);
  const cancelButtonRef = useRef(null);

  const [output, setOutput] = useState(null);

  const onChangeHandler = (areas) => {
    setAreas(areas);
    //cropImageNow(areas);
    //alterCropImage(areas);
  };

  const submitSnippets = () => {
    localStorage.setItem("snippetCoordinates", JSON.stringify(areas));
    setOpenAr(false);
    setSnippetSubmittedA(true);
  };

  //   const cropImageNow = (areasr) => {
  //     const canvas = document.createElement("canvas");
  //     const scaleX = areasr[0].x;
  //     const scaleY = areasr[0].y;
  //     canvas.width = areasr[0].width;
  //     canvas.height = areasr[0].height;
  //     const ctx = canvas.getContext("2d");

  //     const pixelRatio = window.devicePixelRatio;
  //     canvas.width = areasr[0].width * pixelRatio;
  //     canvas.height = areasr[0].height * pixelRatio;
  //     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  //     ctx.imageSmoothingQuality = "high";

  //     ctx.drawImage(
  //       img.image.asset,
  //       areasr[0].x * scaleX,
  //       areasr[0].y * scaleY,
  //       areasr[0].width * scaleX,
  //       areasr[0].height * scaleY,
  //       0,
  //       0,
  //       areasr[0].width,
  //       areasr[0].height
  //     );

  //     const base64Image = canvas.toDataURL("image/jpeg");
  //     setOutput(base64Image);
  //   };

  const alterCropImage = (areas) => {
    // var hotspot = {
    //         "x": areas[0].x/100,
    //         "y": areas[0].y/100,
    //         "height": areas[0].height/100,
    //         "width": areas[0].width/100
    //       }

    var crop = {
      top: 0.028131868131868132,
      bottom: 0.15003663003663004,
      left: 0.01875,
      right: 0.009375000000000022,
    };

    var hotspot = {
      x: 0.812500000000001,
      y: 0.27963369963369955,
      height: 0.3248351648351647,
      width: 0.28124999999999994,
    };

    var im = { ...img.image, crop, hotspot };

    setOutput(im);
  };

  if (areas.length > 0) {
    var xC = (areas[0].x + areas[0].width / 2) / 512;
    var yC = (areas[0].y + areas[0].height / 2) / 512;

    //console.log(xC, yC);
    //console.log("areas ", areas);
  }

  //document.querySelectorAll("[data-wrapper='wrapper']").style.setProperty('border', '1px dashed rgba(255, 0, 0, 0.5) !important');
  return (
    <>
      <Transition.Root show={openAr} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpenAr}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl flex justify-center transition-all sm:my-8 sm:w-full sm:max-w-[600px]">
                  <div className="bg-white items-center flex-col  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="my-3">
                      <p className="tracking-wide font-semibold text-red-800 text-lg lg:leading-8">
                        Drag and select all the areas that look fake :
                      </p>
                    </div>
                    <AreaSelector areas={areas} onChange={onChangeHandler}>
                      <img
                        className="h-[512px] w-[512px]"
                        // src={urlFor(img.image.asset).url()} // Commented out Sanity usage
                        src={img.image.asset} // Use local image path
                      ></img>
                    </AreaSelector>
                    {/* <div>{areas.length>0 && <img src={urlFor(img.image.asset).size(Math.round(areas[0].width/2), Math.round(areas[0].height/2)).focalPoint(xC, yC).url()} />}</div> */}
                    {/* {areas.length > 0 && (
                     <img
                       className=""
                       src={urlFor(img.image.asset)
                         .rect(
                           Math.floor(areas[0].x),
                           Math.floor(areas[0].y),
                           Math.round(areas[0].width),
                           Math.round(areas[0].height)
                         )
                         .url()}
                     />
                   )} */}
                    <div className="my-4 flex justify-center">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={submitSnippets}
                        //href={`${props.abouts[0].resume}?dl=`}
                        className="flex cursor-pointer justify-center rounded-[0.2rem] space-x-5 bg-darkBgLight py-4 font-ubuntu text-lg font-semibold text-white shadow-md shadow-gray-800 transition duration-500 ease-in-out lg:px-10 lg:hover:bg-blue-400 lg:hover:text-darkBgLight"
                      >
                        <p className="tracking-wider">Submit Snippets</p>
                        <ViewGridAddIcon className="h-7 w-7 animate-pulse hover:text-darkBgLight" />
                      </motion.button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
