
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
 
const Question2 = ({load, selectedSetE, selectedIE}) => {
  return (
    <div>
    {
      load
      ? <motion.div
          id="Question"
          className="flex overflow-hidden h-[128px] shadow-md w-[32rem] p-4 bg-white-700 border-4 rounded-lg flex-col "
        >
         <div role="status" className="animate-pulse">
           <div className="h-6 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
           <div className="h-9 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[420px] mb-2.5"></div>
         </div>
       </motion.div>
      : <motion.div
          layout
          id="Question"
          className="flex overflow-hidden items-center shadow-md w-[32rem] p-6 bg-white-700 border-4 rounded-lg flex-col "
        >
         <motion.div layout>
           <motion.p
             layout
             className="tracking-wide font-semibold text-gray-800 text-lg lg:leading-8"
           >
             Please rate your knowledge in medical radiology :
           </motion.p>
         </motion.div>
         <motion.div
           layout
           className={
             "flex flex-col mt-4 overflow-hidden "
           }
         >
           <motion.div
             layout
             className="radio-btn overflow-hidden flex border-r-2"
             onClick={() => selectedSetE("Novice")}
           >
             <motion.input
               layout
               type="radio"
               value={selectedIE}
               name="Novice"
               checked={selectedIE == "Novice"}
             />
             <motion.p layout className="ml-2 tracking-wider">
               Novice
             </motion.p>
           </motion.div>
           <motion.div
             layout
             className="flex overflow-hidden"
             onClick={() => {
               selectedSetE("Advanced Beginner");
              
             }}
           >
             <motion.input
               layout
               type="radio"
               value={selectedIE}
               name="Advanced Beginner"
               checked={selectedIE == "Advanced Beginner"}
             />
             <motion.p layout className="ml-2 tracking-wider">Advanced Beginner</motion.p>
           </motion.div>
           <motion.div
             layout
             className="flex overflow-hidden"
             onClick={() => {
               selectedSetE("Competent");
              
             }}
           >
             <motion.input
               layout
               type="radio"
               value={selectedIE}
               name="Competent"
               checked={selectedIE == "Competent"}
             />
             <motion.p layout className="ml-2 tracking-wider">Competent</motion.p>
           </motion.div>
 
           <motion.div
             layout
             className="flex overflow-hidden"
             onClick={() => {
               selectedSetE("Proficient");
              
             }}
           >
             <motion.input
               layout
               type="radio"
               value={selectedIE}
               name="Proficient"
               checked={selectedIE == "Proficient"}
             />
             <motion.p layout className="ml-2 tracking-wider">Proficient</motion.p>
           </motion.div>
 
           <motion.div
             layout
             className="flex overflow-hidden"
             onClick={() => {
               selectedSetE("Expert");
              
             }}
           >
             <motion.input
               layout
               type="radio"
               value={selectedIE}
               name="Expert"
               checked={selectedIE == "Expert"}
             />
             <motion.p layout className="ml-2 tracking-wider">Expert</motion.p>
           </motion.div>
 
         </motion.div>
 
        
        
       </motion.div>
     }
   </div>
 );
};
 
export default Question2;