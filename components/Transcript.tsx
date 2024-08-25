import React, { useLayoutEffect } from 'react'
import { useEffect, useRef, useState } from 'react';
import AddCommentPopupDialog from '@/components/AddCommentPopupDialog';
import { Comment, CommentMap } from '@/common/types';

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
  setCommentIndex: (commentIndex: number) => void;
  setNewComment: (newComment: string) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
  comments,
  setComments,
  commentsMap,
  setCommentsMap,
  setShowPopup,
  setClickPosition,
  setCommentIndex,
  setNewComment,
})  => {

  const [content, setContent] = useState<string>(
    `0123456789\n
    0123456789\n0123456789\n0123456789\n0123456789\n
    0123456789\n0123456789\n0123456789\n0123456789\n
    0123456789\n0123456789\n0123456789\n`
    // 'Hello, my name is John and I have a friend name .'
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);


  // useLayoutEffect(() => { // does not work
  //   // get position of the comment markers on the page
  //   setTimeout(() => {
  //     for (let i = 0; i < comments.length; i++) {
  //       console.log('comments[i].id: ', comments[i].id);
  //       const element = document.getElementById(comments[i].id);
  //       if (element) {
  //         var rect = element.getBoundingClientRect();
  //         console.log('rect: ', rect);
  //       }else {
  //         console.log(`Element ${comments[i].id} not found.`);
  //       }
  //     }
  //   }, 3000);
  // }, [comments]);

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

    // Get cursor position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    // console.log('selection: ', selection);
    const range = selection.getRangeAt(0);
    // console.log('range: ', range);
    const cursorPosition = range.startOffset;
    console.log('cursorPosition: ', cursorPosition);

    // check commentsMap for comment at cursor position
    if (commentsMap.has(cursorPosition)) {
      const comment = commentsMap.get(cursorPosition);
      if (comment) {
        setNewComment(comment.content);
      }
    } else {
      setNewComment('');
    }
    setCommentIndex(cursorPosition);

    // Open popup dialog
    setClickPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
  };

  return (
    <>
      {/* transcript section  */}
      <div
        ref={parentRef} 
        className="relative h-full "
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