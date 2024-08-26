import React, { useState } from 'react';
import axios from 'axios';

const AssetPicker = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status !== 200) {
        throw new Error('Upload failed.');
      }
      setUploadStatus('Upload successful!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <div>
      <input className="w-full border border-gray-300 rounded-md p-2 mt-2 text-black" type="file" name="file" onChange={handleFileChange} />
      <button 
        className='w-20 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default AssetPicker;
