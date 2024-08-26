// components/AddCommentPopupDialog.tsx
import React, { useEffect, useRef, useState } from 'react';

type CommentDialog = {
  // x: number;
  initialY: number;
  textValue: string
  onDelete: () => void
  dialogHeight: number
  setDialogHeight: (dialogHeight: number) => void
  // setTextValue: (textValue: string) => void
  // onClose: () => void;
  // onSubmit: () => void;
};

const CommentDialog: React.FC<CommentDialog> = ({ 
  // x, 
  initialY, 
  textValue,
  onDelete,
  dialogHeight,
  setDialogHeight,
  // setTextValue,
  // onClose, 
  // onSubmit 
}) => {
  // const dialogRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  
  const [position, setPosition] = useState({ top: initialY, left: 0 });
  // useEffect(() => {
  //   // Adjust position to account for dialog size
  //   setPosition({
  //     top: y,
  //     left: 0,
  //   });
  // }, [y]);
  useEffect(() => {
    console.log('initialY: ', initialY);
    setPosition({
      top: initialY,
      left: 0,
    })
  }, [initialY]);

  useEffect(() => {
    // get dialog width to adjust for overflow on right side
    if (dialogRef.current && dialogHeight === 0) {
      console.log('CommentDialog dialogHeight: ', dialogRef.current.offsetHeight);
      setDialogHeight(dialogRef.current.offsetHeight);
    }
  }, [dialogRef, textValue, dialogHeight]);
  

  return (
    <div
      ref={dialogRef}
      // ref={(el) => {
      //   dialogRef.current = el;
      //   if (el) {
      //     setDialogHeight(el.offsetHeight);
      //   }
      // }}
      className="absolute w-[280px] z-50 border border-gray-300 p-4 shadow-lg"
      // style={{ top: position.top, left: position.left }}
      style={{ top: position.top, left: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div
          className='flex justify-between'
        >
        <h2 className="text-md font-semibold">User name</h2>
        <button
          className='text-red-500'
          onClick={onDelete}
        >
          Delete
        </button>
        </div>
        <article
          className='text-wrap break-words'
        >
          <p className=''>{textValue}</p>
        </article>
      </div>
    </div>
  );
};

export default CommentDialog;
