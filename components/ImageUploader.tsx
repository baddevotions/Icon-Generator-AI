
import React, { useCallback, useRef } from 'react';
import type { UploadedImage } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImages, setUploadedImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIX: Abstract file processing to a shared, memoized function to handle both upload and drag-and-drop.
  const handleFiles = useCallback((files: FileList | null) => {
    if (files) {
      const newImages: UploadedImage[] = [];
      const filesArray = Array.from(files);
      if (filesArray.length === 0) return;

      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({ file, dataUrl: reader.result as string });
          if (newImages.length === filesArray.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [setUploadedImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // FIX: Directly process files from drag-and-drop instead of dispatching an event.
    handleFiles(event.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-indigo-300">1. Upload Style Illustrations</h2>
      <p className="text-sm text-gray-400 mb-4">Upload 1-5 images that define the style of the icon you want to generate. PNGs with transparent backgrounds work best.</p>
      
      <div 
        className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
        <p className="mt-2 text-sm text-gray-400">
          <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-300 mb-3">Your Style Set</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img src={image.dataUrl} alt={`upload-preview-${index}`} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center rounded-lg">
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
