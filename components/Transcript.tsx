import React, { useLayoutEffect } from 'react'
import { useEffect, useRef, useState } from 'react';
import AddCommentPopupDialog from '@/components/AddCommentPopupDialog';
import { Comment, CommentMap } from '@/common/types';
import conversation from '../conversation.json';

// random id generator
const randomId = () => {
  // return 'a'
  return Math.random().toString(36).slice(2, 9);
};

interface TranscriptProps {
  content: JSX.Element[];
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  commentsMap: CommentMap;
  setCommentsMap: (commentsMap: CommentMap) => void;
  setShowPopup: (showPopup: boolean) => void;
  setClickPosition: (clickPosition: { x: number; y: number }) => void;
  setCursorIndex: (commentIndex: number) => void;
  setDivIndex: (divIndex: number) => void;
  setNewCommentContent: (newComment: string) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
  content, 
  comments,
  setComments,
  commentsMap,
  setCommentsMap,
  setShowPopup,
  setClickPosition,
  setCursorIndex,
  setDivIndex,
  setNewCommentContent,
})  => {

  

  useEffect(() => {
    console.log('Transcript useEffect commentsMap: ', commentsMap);
  }, [commentsMap]);
  
  // to add or retrieve comments content and mark the div and cursor position as commented
  const handleSpanClick = (e: React.MouseEvent<HTMLSpanElement>, divIndex: number): void => {
    e.preventDefault();
    console.log('divIndex: ', divIndex);
    setDivIndex(divIndex);

    // Get cursor position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    // console.log('selection: ', selection);
    const range = selection.getRangeAt(0);
    // console.log('range: ', range);
    const cursorPosition = range.startOffset;
    console.log('cursorPosition: ', cursorPosition);

    const key = `${divIndex}-${cursorPosition}`; //
    console.log('key: ', key);

    // check commentsMap for comment at cursor position
    if (commentsMap.has(divIndex)) {
      const comment = commentsMap.get(divIndex);
      if (comment) {
        setNewCommentContent(comment.content);
      }
    } else {
      setNewCommentContent('');
    }
    setCursorIndex(cursorPosition);

    // Open popup dialog
    setClickPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
  };

  return (
    <>
      {/* transcript section  */}
      <div
        // ref={parentRef} 
        className="transcript relative"
      >
        {/* Adding style markers to the content */}
        <div 
          id="mytxt" 
          contentEditable={false} 
          className="w-full "
        >
          {/* Highlight divs with comments */}
          {comments.reduce((acc, comment, idx) => {
            // console.log('comment: ', comment);
            const prevIndex = idx === 0 ? 0 : comments[idx - 1].divIndex + 1;

            acc.push(
              <span key={`text-${idx}`}>{content.slice(prevIndex, comments[idx].divIndex )}</span>
            )
            acc.push(
              <span id={randomId()} key={comment.id} style={{ color: 'blue'}}>{content.slice(comments[idx].divIndex, comments[idx].divIndex + 1)}</span>
            )
            return acc;
          }, [] as JSX.Element[])}
          <span>{content.slice(comments.length > 0 ? comments[comments.length - 1].divIndex + 1 : 0)}</span>
        </div>
        {/* Displaying the actual content in the foreground */}
        <div
          className="absolute  h-full w-full left-0 right-0 top-0 border-2 border-white"
          // onClick={handleDivClick}
          style={{opacity: 0}}
        >
          {content}
        </div>
        {/* {showPopup && (
          <AddCommentPopupDialog
            x={clickPosition.x}
            y={clickPosition.y}
            // parentWidth={parentWidth}
            textValue={newComment}
            setTextValue={setNewCommentContent}
            onClose={closePopup}
            onSubmit={onSubmit}
          />
        )} */}
      </div>
    </>
  )
}

export default Transcript