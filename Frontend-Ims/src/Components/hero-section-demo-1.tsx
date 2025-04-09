"use client";

import { motion } from "motion/react";
export default function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center px-4">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-[#1E1E1E]">
        <div className="absolute top-0 h-40" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-[#1E1E1E]">
        <div className="absolute h-40" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-[#1E1E1E]">
        <div className="absolute mx-auto h-px w-40" />
      </div>
      <div className="px-4 scroll-py-1 ">
        <h1 className="relative z-10 mx-auto max-w-4xl mt-40 text-center text-2xl font-bold text-[#FFFFFF] md:text-4xl lg:text-7xl ">
          {"Launch your inventory system in hours, not days"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-[#ABABAB]"
        >
          With our professional inventory management system, you can streamline your operations and boost productivity. Try our best-in-class tools to get your inventory under control.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button onClick={()=>window.location.href = "/signin"} className="w-60 transform rounded-lg bg-[#0066CC] px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4D90FE]">
            Get Started
          </button>
          <button className="w-60 transform rounded-lg border border-[#1E1E1E] bg-[#121212] px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1E1E1E]">
            View Demo
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-800">
          <div className="text-[#4D90FE] text-xl mb-4">Real-time Tracking</div>
          <p className="text-[#ABABAB]">Monitor inventory levels and movement across multiple locations in real-time.</p>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-800">
          <div className="text-[#00C853] text-xl mb-4">Smart Analytics</div>
          <p className="text-[#ABABAB]">Gain insights with comprehensive reports and analytics on inventory performance.</p>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-800">
          <div className="text-[#4D90FE] text-xl mb-4">Automated Alerts</div>
          <p className="text-[#ABABAB]">Receive instant notifications when inventory levels reach predetermined thresholds.</p>
        </div>
      </motion.div>
    </div>
  );
}

 
