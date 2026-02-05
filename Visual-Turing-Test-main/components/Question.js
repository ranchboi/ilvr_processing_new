import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
 
const Question = ({ load, selectedSet, fakeSelSet, checkedSet, setAreas, selectedI,selectedFI,setSelectedFI, checkedI, fakeSelI ,reqI,setOpenAQ}) => {
  // Only "Real" or "Fake" show as selected; default to "Real" when not "Fake"
  const choice = selectedI === "Fake" ? "Fake" : "Real";

 const handleCheck = (event) => {
   setSelectedFI(event.target.value);
   setOpenAQ(true);
   setAreas([]);
   // var updatedList = [...checkedI];
   // if (event.target.checked) {
   //   updatedList = [...checkedI, event.target.value];
   // } else {
   //   updatedList.splice(checkedI.indexOf(event.target.value), 1);
   // }
   // checkedSet(updatedList);
 };
 
 //console.log("checked : ", checkedI);
 
 const checkList = ["Texture Looks Fake", "Anatomy Looks Fake"];
 return (
   <div>
     {load ? (
       <motion.div
         id="Question"
         className="flex overflow-hidden h-[128px] shadow-md w-[32rem] p-4 bg-white-700 border-4 rounded-lg flex-col "
       >
         <div role="status" className="animate-pulse">
           <div className="h-6 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
           <div className="h-9 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[420px] mb-2.5"></div>
         </div>
       </motion.div>
     ) : (
       <motion.div
        
         layout
         id="Question"
         className="flex overflow-hidden items-center shadow-md w-[32rem] p-6 bg-white-700 border-4 rounded-lg flex-col "
       >
         <motion.div  layout>
           <motion.p
             layout
             className="tracking-wide font-semibold text-gray-800 text-lg lg:leading-8"
           >
             Choose if image shown above is Real or Fake :
           </motion.p>
         </motion.div>
         <motion.div
           layout
           className={
             "flex space-x-28 mt-4 overflow-hidden " + (fakeSelI && "mb-5")
           }
         >
           <motion.div
             layout
             className="radio-btn overflow-hidden flex border-r-2"
           >
             <motion.input
               layout
               type="radio"
               value="Real"
               name="realOrFake"
               checked={choice === "Real"}
               onChange={() => {
                 selectedSet("Real");
                 setSelectedFI("");
                 fakeSelSet(false);
               }}
             />
             <motion.p layout className="ml-2 tracking-wider">
               Real
             </motion.p>
           </motion.div>
           <motion.div
             layout
             className="flex overflow-hidden"
           >
             <motion.input
               layout
               type="radio"
               value="Fake"
               name="realOrFake"
               checked={choice === "Fake"}
               onChange={() => {
                 selectedSet("Fake");
                 fakeSelSet(true);
               }}
             />
             <motion.p layout className="ml-2 tracking-wider">
               Fake
             </motion.p>
           </motion.div>
         </motion.div>
         {fakeSelI && (
           <AnimatePresence>
             <motion.div
               whileInView={{ opacity: [0, 1] }}
               transition={{ duration: 1 }}
               exit={{ opacity: 0 }}
             >
               <motion.div>
                 <p className="tracking-wide font-semibold text-gray-800 text-md lg:leading-8">
                   What's the reason for this choice :
                 </p>
               </motion.div>
 
               <div className="flex flex-col ml-10 space-y-3 mt-4">
                 <motion.div className=" flex border-r-2">
                   <input
                     onChange={handleCheck}
                     type="radio"
                     value="Almost Real"
                     name="aReal"
                     checked={selectedFI == "Almost Real"}
                   />
                   <p className="ml-2 tracking-wider">Almost Real</p>
                 </motion.div>
                 <motion.div
                   className="flex"
                  
                 >
                   <input
                     onChange={handleCheck}
                     type="radio"
                     value="Somewhat Real"
                     name="sReal"
                     checked={selectedFI == "Somewhat Real"}
                   />
                   <p className="ml-2 tracking-wider">Somewhat Real</p>
                 </motion.div>
                 <motion.div
                   className="flex"
                  
                 >
                   <input
                     onChange={handleCheck}
                     type="radio"
                     value="Clearly Fake"
                     name="cFake"
                     checked={selectedFI == "Clearly Fake"}
                   />
                   <p className="ml-2 tracking-wider">Clearly Fake</p>
                 </motion.div>
               </div>
             </motion.div>
           </AnimatePresence>
         )}
         <div className="mt-3">
         {(reqI && selectedI.length==0)&& (
                   <span className="text-red-500">
                     - Please Choose an option
                   </span>
                 )}
         {(reqI &&  selectedI=="Fake" && selectedFI.length==0)&& (
           <span className="text-red-500">
             - Please Choose an option
           </span>
         )}      
         </div>
       </motion.div>
     )}
   </div>
 );
};
 
export default Question;
 

