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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // const dialogRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   // Adjust position to account for dialog size
  //   setPosition({
  //     top: y,
  //     left: 0,
  //   });
  // }, [y]);

  useEffect(() => {
    // get dialog width to adjust for overflow on right side
    if (dialogRef.current && dialogHeight === 0) {
      console.log('CommentDialog dialogHeight: ', dialogRef.current.offsetHeight);
      setDialogHeight(dialogRef.current.offsetHeight);
    }
  }, [dialogRef, textValue]);
  

  return (
    <div
      ref={dialogRef}
      // ref={(el) => {
      //   dialogRef.current = el;
      //   if (el) {
      //     setDialogHeight(el.offsetHeight);
      //   }
      // }}
      className="absolute w-[200px] z-50 border border-gray-300 p-4 shadow-lg"
      // style={{ top: position.top, left: position.left }}
      style={{ top: initialY, left: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div
          className='flex justify-between'
        >
        <h2 className="text-lg font-semibold">User name</h2>
        <button
          onClick={onDelete}
        >Delete</button>
        </div>
        <article
          className='text-wrap bg-red-300 break-words'
        >
          <p className='bg-blue-300'>{textValue}</p>
        </article>
      </div>
    </div>
  );
};

export default CommentDialog;
