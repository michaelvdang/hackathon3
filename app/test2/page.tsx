'use client'
import Image from "next/image";
import conversation from "../../conversation.json";
import { useEffect, useState } from "react";



function Comment(props: { commentId: string }) {
  return (
    <div
      className="bg-gray-300"
    >
      comment
      {/* {props.commentId} */}
    </div>
  );
}

export default function Home() {

  const [fullTranscript, setFullTranscript] = useState<string>("");

  const handleTextClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    
    const beforeCursor = fullTranscript.slice(0, cursorPosition);
    const afterCursor = fullTranscript.slice(cursorPosition);

    const commentTag = '<Comment commentId="123abc" />';

    const updatedTranscript = beforeCursor + commentTag + afterCursor;

    setFullTranscript(updatedTranscript);
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create a span element with the commentId
    const commentSpan = document.createElement('span');
    commentSpan.textContent = '<Comment commentId="123abc" />';
    commentSpan.className = 'comment-tag';

    // Insert the commentSpan at the caret position
    range.insertNode(commentSpan);

    // Move the caret after the newly inserted comment
    range.setStartAfter(commentSpan);
    range.setEndAfter(commentSpan);
    
    // Collapse the range to remove any selection
    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    setFullTranscript(conversation.messages.map(message => message.role + ": " + message.content).join("\n\n"));
  }, []);

  useEffect(() => {
    console.log(fullTranscript);
  }, [fullTranscript]);

  return (
    <div
      className=" bg-red-400"
    >
      <div id="mytxt" contentEditable="true" onClick={handleDivClick}>
        Hello, my name is <span className="font-bold" id="abc123">John</span>
        and I have a friend name .
      </div>
      <div 
          className="min-w-96 gap-y-2 flex flex-col"
      >
          <textarea 
            id="message"
            className="w-3/4"
            value={fullTranscript}
            readOnly
            onClick={() => console.log("clicked")}
            // onClickCapture={() => setFullTranscript(conversation.messages.map(message => message.role + ": " + message.content).join("\n\n"))}
            // onClickCapture={() => alert("clicked")}
            onClickCapture={handleTextClick}
          />
      </div>
      {/* {conversation.messages.map((message, index) => (
        <div 
          className="min-w-96 gap-y-2 flex flex-col"
        key={index}>
          <textarea 
            id="message"
            className="w-3/4"
            value={message.content}
            readOnly
            onClick={() => console.log("clicked")}
          />
      </div>
      ))} */}
      
    </div>
  );
}
