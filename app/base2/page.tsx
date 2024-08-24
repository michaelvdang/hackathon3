'use client'
import Image from "next/image";
import conversation from "../../conversation.json";
import { useEffect, useState } from "react";

// random id generator
const randomId = () => {
  return Math.random().toString(36).slice(2, 9);
};


// Define the comment type
interface Comment {
  id: string;
  index: number;
}

// Create a type for the Map
type CommentMap = Map<number, Comment>;

export default function Home() {

  const [content, setContent] = useState<string>(
    '0123456789'
    // 'Hello, my name is John and I have a friend name .'
  );
  // const [comments, setComments] = useState<CommentMap>(new Map());
  
  const [comments, setComments] = useState<{ id: string; index: number }[]>([]);
  const [renderedContent, setRenderedContent] = useState<string>(content);

  useEffect(() => {
    console.log('comments: ', comments);

    // 
    
    
  }, [comments]);
  
  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    console.log('selection: ', selection);

    const range = selection.getRangeAt(0);
    console.log('range: ', range);
    const cursorPosition = range.startOffset;
    console.log('cursorPosition: ', cursorPosition);

    // store new comments positions in descending order of index
    const updatedComments = [...comments, { id: randomId(), index: cursorPosition }].sort((a, b) => a.index - b.index);
    setComments(updatedComments);

  };

  return (
    <div 
      id="mytxt" 
      contentEditable={false} 
      onClick={handleDivClick} 
      style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}
    >
      {comments.reduce((acc, comment, idx) => {
        const prevIndex = idx === 0 ? 0 : comments[idx - 1].index;

        acc.push(
          <span>{content.slice(prevIndex, comments[idx].index )}</span>
        )
        acc.push(
          <span bg-color="red">{content.slice(comments[idx].index, comments[idx].index + 1)}</span>
        )
        // return [<span>hi</span>];
        return acc;
      }, [] as JSX.Element[])}
      <span>{content.slice(comments.length > 0 ? comments[comments.length - 1].index + 1 : 0)}</span>
    </div>
  );
}
