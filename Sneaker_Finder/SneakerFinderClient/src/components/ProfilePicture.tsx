import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface ProfilePictureProps {
  onUploadSuccess?: (url: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userData, updateUserData } = useAuth();

  const handleFileChange = (file: File) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      handleUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/me/profile-picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the user data in context with the new profile picture URL
      updateUserData({ profilePicture: response.data.profilePicture });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.profilePicture);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer ${
          isDragging ? 'border-2 border-blue-500' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl || userData?.profilePicture ? (
          <img
            src={previewUrl || userData?.profilePicture}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Avatar</span>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-[#1C2632] text-white px-4 py-2 rounded-full w-full hover:bg-opacity-90 disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Zmień avatar'}
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePicture;
