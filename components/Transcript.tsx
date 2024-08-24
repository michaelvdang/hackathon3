import React, { useLayoutEffect } from 'react'
import { useEffect, useRef, useState } from 'react';
import PopupDialog from '@/components/PopupDialog';

// random id generator
const randomId = () => {
  return 'a'
  // return Math.random().toString(36).slice(2, 9);
};


// Define the comment type
interface Comment {
  id: string;
  index: number;
  // content: string;
}

// Create a type for the Map
type CommentMap = Map<number, Comment>;
const Transcript = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState<string>(
    `0123456789\n
    0123456789\n0123456789\n0123456789\n`
    // 'Hello, my name is John and I have a friend name .'
  );
  const [commentsMap, setCommentsMap] = useState<CommentMap>(new Map());  // to remove comments
  const [comments, setComments] = useState<Comment[]>([]);  // to render comments
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [commentIndex, setCommentIndex] = useState<number>(0);

  const closePopup = () => setShowPopup(false);

  useLayoutEffect(() => {
    const element = document.getElementById('a');
    if (element) {
      var rect = element.getBoundingClientRect();
      console.log('rect: ', rect);
    }
  }, [comments]);

  useEffect(() => {
    if (parentRef.current) {
      // Option 1: Using offsetWidth
      const width = parentRef.current.offsetWidth;

      // Option 2: Using getBoundingClientRect
      // const width = parentRef.current.getBoundingClientRect().width;

      setParentWidth(width);
    }
  }, []);

  useEffect(() => {
    console.log('commentsMap: ', commentsMap);
  }, [commentsMap]);
  

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    // console.log('selection: ', selection);
    const range = selection.getRangeAt(0);
    // console.log('range: ', range);
    const cursorPosition = range.startOffset;
    // console.log('cursorPosition: ', cursorPosition);

    setCommentIndex(cursorPosition);

    // Open popup dialog
    setClickPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
  };

  // get comment from map based on comment index

  const getComment = () => {
    if (commentsMap.has(commentIndex)) {
      const comment = commentsMap.get(commentIndex);
      if (comment) {
        // setNewComment(comment.content);
        return comment;
      }
    } else {
      return null;
    }
  }

  const updateComments = () => {
    // remove comment if it already exists
    if (commentsMap.has(commentIndex)) {
      commentsMap.delete(commentIndex);
    } else {
      commentsMap.set(commentIndex, { id: randomId(), index: commentIndex });
    }

    // convert map to comments array
    let updatedComments: { id: string; index: number }[] = [];
    commentsMap.forEach((comment, index) => {
      updatedComments.push({ id: comment.id, index });
    })
    updatedComments.sort((a, b) => a.index - b.index);
    setComments(updatedComments);
    // console.log('updatedComments: ', updatedComments);
  }

  const onSubmit = () => {
    if (!newComment) {
      alert('Please enter a comment');
      return;
    }

    
    
    // Add your submit logic here
    console.log("commentsMap: ", commentsMap);
    closePopup();
  };
  return (
    <>
      {/* transcript section  */}
      <div
        ref={parentRef} 
        className="relative h-full w-full "
      >
        
        <div 
          id="mytxt" 
          contentEditable={false} 
          className="absolute  h-full w-full left-0 right-0 top-0 border-2 border-white"
        >
          {comments.reduce((acc, comment, idx) => {
            const prevIndex = idx === 0 ? 0 : comments[idx - 1].index + 1;

            acc.push(
              <span key={`text-${idx}`}>{content.slice(prevIndex, comments[idx].index )}</span>
            )
            acc.push(
              <span id={randomId()} key={comment.id} style={{ color: 'red'}}>{content.slice(comments[idx].index, comments[idx].index + 1)}</span>
            )
            return acc;
          }, [] as JSX.Element[])}
          <span>{content.slice(comments.length > 0 ? comments[comments.length - 1].index + 1 : 0)}</span>
        </div>
        <div
          className="absolute  h-full w-full left-0 right-0 top-0 border-2 border-white"
          onClick={handleDivClick}
        >
          <span style={{ opacity: '0'}}>{content}</span>
        </div>
        {showPopup && (
          <PopupDialog
            x={clickPosition.x}
            y={clickPosition.y}
            // parentWidth={parentWidth}
            textValue={newComment}
            setTextValue={setNewComment}
            onClose={closePopup}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </>
  )
}

export default Transcript