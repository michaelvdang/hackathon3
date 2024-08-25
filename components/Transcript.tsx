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
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  commentsMap: CommentMap;
  setCommentsMap: (commentsMap: CommentMap) => void;
  setShowPopup: (showPopup: boolean) => void;
  setClickPosition: (clickPosition: { x: number; y: number }) => void;
  setCursorIndex: (commentIndex: number) => void;
  setDivIndex: (divIndex: number) => void;
  setNewComment: (newComment: string) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
  comments,
  setComments,
  commentsMap,
  setCommentsMap,
  setShowPopup,
  setClickPosition,
  setCursorIndex,
  setDivIndex,
  setNewComment,
})  => {

  const [content, setContent] = useState<JSX.Element[]>([]);
  // const [content, setContent] = useState<string>('');

  useEffect(() => {
    const messages = (conversation.messages.map((message, index) => (
      <div key={index} style={{ paddingBottom: '10px'}}>
        <span style={{ fontWeight: 'bold' }}>
          {message.role + ": "}
        </span>
        <span onClick={e => handleSpanClick(e, index)} style={{ cursor: 'pointer'}}>
          {message.content}
        </span>
      </div>
    )));

    setContent(messages);
  }, []);
  

  useEffect(() => {
    console.log('commentsMap: ', commentsMap);
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
        setNewComment(comment.content);
      }
    } else {
      setNewComment('');
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
        className="relative"
      >
        {/* Adding style markers to the content */}
        <div 
          id="mytxt" 
          contentEditable={false} 
          className="w-full border-2 border-white"
        >
          {comments.reduce((acc, comment, idx) => {
            console.log('comment: ', comment);
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
            setTextValue={setNewComment}
            onClose={closePopup}
            onSubmit={onSubmit}
          />
        )} */}
      </div>
    </>
  )
}

export default Transcript