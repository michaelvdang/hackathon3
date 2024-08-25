// components/AddCommentPopupDialog.tsx
import React, { useEffect, useRef, useState } from 'react';

type AddCommentPopupDialogProps = {
  x: number;
  y: number;
  verticalOffset?: number
  parentWidth?: number
  textValue: string
  setTextValue: (textValue: string) => void
  onClose: () => void;
  onSubmit: () => void;
};

const AddCommentPopupDialog: React.FC<AddCommentPopupDialogProps> = ({ x, y, verticalOffset = 0, parentWidth = 10000, textValue, setTextValue,onClose, onSubmit }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogWidth, setDialogWidth] = useState(0);

  console.log("verticalOffset: ", verticalOffset);
  
  useEffect(() => {
    // get dialog width to adjust for overflow on right side
    if (dialogRef.current) {
      setDialogWidth(dialogRef.current.offsetWidth);
      // console.log('dialogWidth: ', dialogRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    // Adjust position to account for dialog size
    // const verticalOffset = -64; // Add some offset to avoid placing it directly under the cursor
    const offset = 0; // Add some offset to avoid placing it directly under the cursor
    // console.log('x: ', x);
    // console.log('dialogWidth: ', dialogWidth);
    // console.log('prentWidth: ', parentWidth);
    const left = x + dialogWidth + offset > parentWidth ? x - dialogWidth - offset : x + offset;
    setPosition({
      top: y + offset + verticalOffset,
      // left: left,
      left: 10,
    });
  }, [x, y, dialogWidth, parentWidth]);

  return (
    <div
      ref={dialogRef}
      className="absolute w-[300px] z-50 bg-white border border-gray-300 p-4 shadow-lg"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <h2 className="text-lg text-black font-semibold">Add Comment</h2>
        <textarea 
          className="w-full border border-gray-300 rounded-md p-2 mt-2 text-black"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        {/* <input 
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 mt-2 text-black"
          placeholder="Enter comment here"
        /> */}
        <div
          className="flex justify-between"
        >

          <button
            className="w-20 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="w-20 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCommentPopupDialog;
