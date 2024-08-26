'use client'
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Transcript from "@/components/Transcript";
import { Comment, CommentMap, TranscriptMessage } from "@/common/types";
import AddCommentPopupDialog from "@/components/AddCommentPopupDialog";
import CommentDialog from "@/components/CommentDialog";
import { comment } from "postcss";
import useScroll from "@/hooks/useScroll";
import CommentsSummary from "@/components/CommentsSummary";
import SaveSection from "@/components/SaveSection";
import conversation from "../conversation.json";

const commentDialogOffset = 40;

// random id generator
const randomId = () => {
  // return 'a'
  return Math.random().toString(36).slice(2, 9);
};
export default function Home() {
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);  // to render comments
  const [commentsMap, setCommentsMap] = useState<CommentMap>(new Map());  // to remove comments
  const [showPopup, setShowPopup] = useState(false);
  const [cursorIndex, setCursorIndex] = useState<number>(0); // position of the cursor in the transcript, 'I like cats', comment at k would make cursorIndex = 4
  const [divIndex, setDivIndex] = useState<number>(0);
  const [newCommentContent, setNewCommentContent] = useState<string>(''); // value in the AddCommentPopupDialog
  const closePopup = () => setShowPopup(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  // const dialogTopOffset = useRef<number>(0);
  const [dialogTopOffset, setDialogTopOffset] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTopOffset, setContainerTopOffset] = useState<number>(0);

  const scrollPosition = useScroll();

  const [content, setContent] = useState<JSX.Element[]>([]);
  // const [content, setContent] = useState<string>('');

  // useEffect(() => {
  //   const transcriptMessages = conversation.messages.map((message, index) => ({
  //       role: message.role,
  //       content: message.content
  //     })
  //   );
  //   console.log('transcriptMessages: ', transcriptMessages);
  //   setMessages(transcriptMessages);
  // }, []);

  // to render transcript  with click listener
  useEffect(() => {
    const newMessages = (messages.map((message, index) => (
      <div key={index} style={{ paddingBottom: '10px'}}>
        <span style={{ fontWeight: 'bold' }}>
          {message.role + ": "}
        </span>
        <span onClick={e => handleSpanClick(e, index)} style={{ cursor: 'pointer'}}>
          {message.content}
        </span>
      </div>
    )));

    setContent(newMessages);
  }, [messages]);

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
        offsets.push(Math.max(offsets[i-1] + comments[i-1].dialogHeight, comments[i].y - commentDialogOffset));
      }
      setDialogTopOffset(offsets);
    }
  }, [comments]);

  const convertCommentsMapToArray = () => {
    // convert map to comments array
    let updatedComments: Comment[] = [];
    commentsMap.forEach((comment, index) => {
      updatedComments.push({ id: comment.id, cursorIndex: comment.cursorIndex, divIndex: comment.divIndex, content: comment.content, x: comment.x, y: comment.y, dialogHeight: 0, bottomOffset: 0, type: 'text' });
    })
    updatedComments.sort((a, b) => a.divIndex === b.divIndex ? a.cursorIndex - b.cursorIndex : a.divIndex - b.divIndex); // sort comments first by divIndex and then cursorIndex
    console.log('updatedComments: ', updatedComments);
    setComments(() => updatedComments);
    // console.log('updatedComments: ', updatedComments);
  }
  
  const addComment = () => {
    const commentObj = { id: randomId(), cursorIndex: cursorIndex, divIndex: divIndex, content: newCommentContent, x: clickPosition.x, y: clickPosition.y + scrollPosition, dialogHeight: 0, bottomOffset: 0, type: 'text' }
    commentsMap.set(divIndex, commentObj);

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
    if (!newCommentContent) {
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
      className="container max-w-screen-xl mx-auto mt-16"
    >
      {/* container for transcript and comments sections */}
      <div 
        className="flex flex-nowrap min-w-[1280px] rounded-t-3xl"
      >
        {/* transcript section  */}
        <div 
          className="min-w-[960px] w-[960px] flex-grow relative p-4 "
        >
          <Transcript 
            content={content}
            comments={comments} 
            setComments={setComments} 
            commentsMap={commentsMap} 
            setCommentsMap={setCommentsMap} 
            setShowPopup={setShowPopup}
            setClickPosition={setClickPosition}
            setCursorIndex={setCursorIndex}
            setDivIndex={setDivIndex}
            setNewCommentContent={setNewCommentContent}
          />
        </div>
        {/* comments section  */}
        <div 
          className="comments relative min-w-[320px] w-[320px] p-4 rounded-tr-3xl"
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
              textValue={newCommentContent}
              setTextValue={setNewCommentContent}
              onClose={closePopup}
              onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
      {/* comments summary section  */}
      
      <div
        className="rounded-b-3xl p-4"
      >
        <CommentsSummary content={content} comments={comments} />
      </div>
      {/* save button section  */}
      
      <div
        className="rounded-b-3xl p-4"
      >
        <SaveSection messages={messages} setMessages={setMessages} commentsMap={commentsMap} setCommentsMap={setCommentsMap} convertCommentsMapToArray={convertCommentsMapToArray}/>
      </div>
    </div>
    </>
  );
}
