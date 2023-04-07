import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from '@cloudinary/react';
import { v2 as cloudinary } from 'cloudinary';

const ProfilePictureDropzone = ({ setFieldValue }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('upload_preset', 'your_cloudinary_upload_preset');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUploadedImage(data.secure_url);
    setFieldValue('profilePicture', data.secure_url);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div
      {...getRootProps()}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <Image publicId={uploadedImage} width="100%" height="100%" crop="fill" />
      ) : (
        <div>Drag and drop or click to select image</div>
      )}
    </div>
  );
};

export default ProfilePictureDropzone;
