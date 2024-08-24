'use client'
import Image from "next/image";
import conversation from "../../conversation.json";
import { useEffect, useState } from "react";

// Comment Component (Small Red Square)
const Comment: React.FC<{ id: string }> = ({ id }) => {
  return (
    <span 
      id={id} 
      style={{ 
        display: 'inline-block',
        width: '10px', 
        height: '10px', 
        backgroundColor: 'red', 
        marginLeft: '2px' 
      }} 
    />
  );
};

export default function Home() {

  const [content, setContent] = useState<string>(
    'Hello, my name is John and I have a friend name .'
  );
  const [comments, setComments] = useState<{ id: string; index: number }[]>([]);

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    // console.log('selection: ', selection);

    const range = selection.getRangeAt(0);
    // console.log('range: ', range);
    const cursorPosition = range.startOffset;
    // console.log('cursorPosition: ', cursorPosition);
    
    
    
    // Create a unique ID for the new comment
    const commentId = `comment-${comments.length + 1}`;

    // // Insert a placeholder for the comment in the text content
    // const updatedContent = [
    //   content.slice(0, cursorPosition),
    //   `<Comment id="${commentId}" />`,
    //   content.slice(cursorPosition),
    // ].join('');

    // setContent(updatedContent);

    // Add the comment to the state
    setComments([...comments, { id: commentId, index: cursorPosition }]);
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
        const before = content.slice(prevIndex, comment.index);
        acc.push(<span key={`text-${idx}`}>{before}</span>);
        acc.push(<Comment key={comment.id} id={comment.id} />);
        return acc;
      }, [] as JSX.Element[])}
      <span>{content.slice(comments.length > 0 ? comments[comments.length - 1].index : 0)}</span>
    </div>
  );
}
