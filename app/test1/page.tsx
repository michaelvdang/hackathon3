import Image from "next/image";
import conversation from "../../conversation.json";

export default function Home() {
  return (
    <div
      className=" bg-red-400"
    >
      {/* container for transcript and comments sections */}
      <div 
        className="bg-blue-200 flex flex-col md:flex-row"
      >

        {/* transcript section  */}
        <div 
          className="min-w-96 w-1/4 bg-orange-200"
        >
          {conversation.messages[0].content}
        </div>
        {/* comments section  */}
        <div 
          className=" flex-grow bg-green-200"
        >
          hello
        </div>
      </div>
      <div
        className="bg-yellow-200"
      >
        bottom
      </div>
      {/* comments summary section  */}
      
    </div>
  );
}
