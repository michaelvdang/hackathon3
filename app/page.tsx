'use client'
import Image from "next/image";
import conversation from "../conversation.json";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Transcript from "@/components/Transcript";
import { Comment, CommentMap } from "@/common/types";
import AddCommentPopupDialog from "@/components/AddCommentPopupDialog";
import CommentDialog from "@/components/CommentDialog";
import { comment } from "postcss";
import useScroll from "@/hooks/useScroll";

// random id generator
const randomId = () => {
  // return 'a'
  return Math.random().toString(36).slice(2, 9);
};
export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);  // to render comments
  const [commentsMap, setCommentsMap] = useState<CommentMap>(new Map());  // to remove comments
  const [showPopup, setShowPopup] = useState(false);
  const [cursorIndex, setCursorIndex] = useState<number>(0); // position of the cursor in the transcript, 'I like cats', comment at k would make cursorIndex = 4
  const [divIndex, setDivIndex] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>(''); // value in the AddCommentPopupDialog
  const closePopup = () => setShowPopup(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  // const dialogTopOffset = useRef<number>(0);
  const [dialogTopOffset, setDialogTopOffset] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTopOffset, setContainerTopOffset] = useState<number>(0);

  const scrollPosition = useScroll();
  
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log('useLayoutRect: ', rect);

      // setContainerTopOffset(0);
      setContainerTopOffset(rect.top);
    }
  }, []);
  
  useEffect(() => {
    console.log('commentsMap: ', commentsMap);
    console.log('comments: ', comments);
  }, [commentsMap, comments]);

  useEffect(() => {
    // update the minimum offset of the next comment dialog
    if (comments.length > 0) {
      let offsets = [comments[0].y];
      for (let i = 1; i < comments.length; i++) {
        offsets.push(Math.max(offsets[i-1] + comments[i-1].dialogHeight, comments[i].y));
      }
      setDialogTopOffset(offsets);
    }
  }, [comments]);

  const convertCommentsMapToArray = () => {
    // convert map to comments array
    let updatedComments: Comment[] = [];
    commentsMap.forEach((comment, index) => {
      updatedComments.push({ id: comment.id, cursorIndex: comment.cursorIndex, divIndex: comment.divIndex, content: comment.content, x: comment.x, y: comment.y, dialogHeight: 0, bottomOffset: 0 });
    })
    updatedComments.sort((a, b) => a.divIndex === b.divIndex ? a.cursorIndex - b.cursorIndex : a.divIndex - b.divIndex); // sort comments first by divIndex and then cursorIndex
    setComments(() => updatedComments);
    // console.log('updatedComments: ', updatedComments);
  }
  
  const addComment = () => {
    commentsMap.set(divIndex, { id: randomId(), cursorIndex: cursorIndex, divIndex: divIndex, content: newComment, x: clickPosition.x, y: clickPosition.y + scrollPosition, dialogHeight: 0, bottomOffset: 0 });

    convertCommentsMapToArray();
    // // convert map to comments array
    // let updatedComments: Comment[] = [];
    // commentsMap.forEach((comment, index) => {
    //   updatedComments.push({ id: comment.id, index, content: comment.content, x: comment.x, y: comment.y, dialogHeight: 0 });
    // })
    // updatedComments.sort((a, b) => a.index - b.index);
    // setComments(updatedComments);
    // // console.log('updatedComments: ', updatedComments);
  }

  const onSubmit = () => {
    // Add your submit logic here
    if (!newComment) {
      alert('Please enter a comment');
      return;
    }
    addComment();
    
    console.log("commentsMap: ", commentsMap);
    closePopup();
  };
  
  const onDelete = (divIndex: number, cursorIndex: number) => {
    const key = `${divIndex}-${cursorIndex}`
    console.log('index: ', key);
    console.log("map keys: ", commentsMap.keys());
    console.log("map has key: ", commentsMap.has((divIndex)));
    const deletedComment = commentsMap.delete((divIndex));
    console.log('deletedComment: ', deletedComment);
    setComments(comments.filter((comment) => comment.divIndex !== divIndex && comment.cursorIndex !== cursorIndex));
  };
  
  return (
    <>
    <div
      ref={containerRef}
      className=" bg-red-400 max-w-screen-xl mx-auto mt-16"
    >
      {/* container for transcript and comments sections */}
      <div 
        className="bg-blue-700 flex flex-nowrap min-w-[1280px] "
      >
        {/* transcript section  */}
        <div 
          className=" bg-orange-300 min-w-[960px] w-[960px] flex-grow relative"
        >
          <Transcript 
            comments={comments} 
            setComments={setComments} 
            commentsMap={commentsMap} 
            setCommentsMap={setCommentsMap} 
            setShowPopup={setShowPopup}
            setClickPosition={setClickPosition}
            setCursorIndex={setCursorIndex}
            setDivIndex={setDivIndex}
            setNewComment={setNewComment}
          />
        </div>
        {/* comments section  */}
        <div 
          className="relative bg-green-700 min-w-[320px] w-[320px] "
        >
          {comments.map((comment, index) => {
            // dialogTopOffset.current = dialogTopOffset.current + comment.dialogHeight;
            return (
              <CommentDialog
                key={index}
                initialY={dialogTopOffset[index] - containerTopOffset}
                textValue={comment.content}
                // initialY={dialogTopOffset.current}
                // y={comment.y}
                onDelete={() => onDelete(comment.divIndex, comment.cursorIndex)}
                dialogHeight={comment.dialogHeight} // use container to set its own height
                setDialogHeight={(height: number) => {
                  console.log('setDialogHeight height: ', height);
                  console.log('setDialogHeight comment.cursorIndex: ', comment.cursorIndex);
                  // update dialogHeight
                  const updatedComments = [...comments];
                  updatedComments[index].dialogHeight = height;
                  setComments(updatedComments);
                  commentsMap.set(comment.divIndex, { ...comment, dialogHeight: height });
                }}
              />
            )
          })}
          {showPopup && (
            <AddCommentPopupDialog
              x={clickPosition.x}
              y={clickPosition.y - containerTopOffset + scrollPosition}
              // verticalOffset={-1 * containerTopOffset}
              // parentWidth={parentWidth}
              textValue={newComment}
              setTextValue={setNewComment}
              onClose={closePopup}
              onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
      {/* comments summary section  */}
      
    <div
      className="bg-yellow-700"
    >
      Bottom
    </div>
    </div>
    </>
  );
}
