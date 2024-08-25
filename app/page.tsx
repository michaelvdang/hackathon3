'use client'
import Image from "next/image";
import conversation from "../conversation.json";
import { useEffect, useRef, useState } from "react";
import Transcript from "@/components/Transcript";
import { Comment, CommentMap } from "@/common/types";
import AddCommentPopupDialog from "@/components/AddCommentPopupDialog";
import CommentDialog from "@/components/CommentDialog";
import { comment } from "postcss";

// random id generator
const randomId = () => {
  // return 'a'
  return Math.random().toString(36).slice(2, 9);
};
export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);  // to render comments
  const [commentsMap, setCommentsMap] = useState<CommentMap>(new Map());  // to remove comments
  const [showPopup, setShowPopup] = useState(false);
  const [commentIndex, setCommentIndex] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const closePopup = () => setShowPopup(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    console.log('commentsMap: ', commentsMap);
    console.log('comments: ', comments);
  }, [commentsMap, comments]);
  
  const addComment = () => {
    commentsMap.set(commentIndex, { id: randomId(), index: commentIndex, content: newComment, x: clickPosition.x, y: clickPosition.y, dialogHeight: 0 });

    // convert map to comments array
    let updatedComments: Comment[] = [];
    commentsMap.forEach((comment, index) => {
      updatedComments.push({ id: comment.id, index, content: comment.content, x: comment.x, y: comment.y, dialogHeight: 0 });
    })
    updatedComments.sort((a, b) => a.index - b.index);
    setComments(updatedComments);
    // console.log('updatedComments: ', updatedComments);
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
  
  const onDelete = (index: number) => {
    console.log('index: ', index);
    console.log("map keys: ", commentsMap.keys());
    console.log("map has index: ", commentsMap.has((index)));
    const deletedComment = commentsMap.delete((index));
    console.log('deletedComment: ', deletedComment);
    setComments(comments.filter((comment) => comment.index !== index));
  };
  
  return (
    <div
      className=" bg-red-400 max-w-screen-xl mx-auto mt-16"
    >
      {/* container for transcript and comments sections */}
      <div 
        className="bg-blue-700 flex flex-nowrap min-w-[1200px] "
      >
        {/* transcript section  */}
        <div 
          className=" bg-orange-300 h-screen w-[960px]  overflow-auto"
        >
          <div
            className="w-full h-full"
          >
            <Transcript 
              comments={comments} 
              setComments={setComments} 
              commentsMap={commentsMap} 
              setCommentsMap={setCommentsMap} 
              setShowPopup={setShowPopup}
              setClickPosition={setClickPosition}
              setCommentIndex={setCommentIndex}
              setNewComment={setNewComment}
            />
          </div>
        </div>
        {/* comments section  */}
        <div 
          className=" bg-green-700  w-[320px] h-screen overflow-auto"
        >
          <div
            className="relative w-full h-full"
          >
            {comments.map((comment, index) => (
              <CommentDialog
                key={index}
                textValue={comment.content}
                initialY={index * 80}
                // y={comment.y}
                onDelete={() => onDelete(comment.index)}
                dialogHeight={comment.dialogHeight} // use container to set its own height
                setDialogHeight={(height: number) => {
                  console.log('setDialogHeight height: ', height);
                  console.log('setDialogHeight comment.index: ', comment.index);
                  const updatedComments = [...comments];
                  updatedComments[index].dialogHeight = height;
                  setComments(updatedComments);
                  commentsMap.set(comment.index, { ...comment, dialogHeight: height });
                }}
              />
            ))}
            {showPopup && (
              <AddCommentPopupDialog
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
        </div>
      </div>
      <div
        className="bg-yellow-700"
      >
        Bottom
      </div>
      {/* comments summary section  */}
      
    </div>
    
  );
}
