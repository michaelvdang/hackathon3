'use client'
import Image from "next/image";
import conversation from "../conversation.json";
import { useEffect, useRef, useState } from "react";
import PopupDialog from "@/components/PopupDialog";
import Transcript from "@/components/Transcript";


export default function Home() {
  

  return (
    <div
      className=" bg-red-400 max-w-screen-xl mx-auto mt-16"
    >
      {/* container for transcript and comments sections */}
      <div 
        className="bg-blue-200 flex flex-col md:flex-row justify-center items-center gap-2"
      >

        {/* transcript section  */}
        <div 
          className="min-w-96 w-3/4 md:w-1/2 bg-orange-200"
        >
          <div
            className="w-full h-80"
          >
            <Transcript />
          </div>
        </div>
        {/* comments section  */}
        <div 
          className=" flex-grow w-3/4 md:w-1/2 hidden md:flex bg-green-200"
        >
          <div
            className="w-full h-80"
          >
            Right
          </div>
        </div>
      </div>
      <div
        className="bg-yellow-200"
      >
        Bottom
      </div>
      {/* comments summary section  */}
      
    </div>
    
  );
}
