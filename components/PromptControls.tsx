
import React, { useRef } from 'react';
import { WandIcon } from './icons/WandIcon';
import { ImageIcon } from './icons/ImageIcon';
import { TrashIcon } from './icons/TrashIcon';
import type { UploadedImage } from '../types';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReady: boolean;
  contentImage: UploadedImage | null;
  setContentImage: (image: UploadedImage | null) => void;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, onGenerate, isLoading, isReady, contentImage, setContentImage }) => {
  const contentFileInputRef = useRef<HTMLInputElement>(null);

  const handleContentFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setContentImage({ file, dataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
      event.target.value = ''; // Reset file input to allow re-uploading the same file
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-indigo-300">2. Define Icon Content</h2>
      
      {/* --- Section for Content Image --- */}
      <div>
        <h3 className="text-md font-medium text-gray-300">a. Reference Image <span className="text-gray-500 font-normal">(Optional)</span></h3>
        <p className="text-sm text-gray-400 mb-4">Upload an image to guide the AI on the subject of the icon.</p>
        
        {contentImage ? (
          <div className="relative w-32 h-32 mb-4 group">
            <img src={contentImage.dataUrl} alt="Content preview" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center rounded-lg">
              <button
                onClick={() => setContentImage(null)}
                className="p-2 bg-red-600/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove content image"
                disabled={isLoading}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800 transition-colors mb-4"
            onClick={() => !isLoading && contentFileInputRef.current?.click()}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">Click to upload</span>
            </p>
            <input
              ref={contentFileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleContentFileChange}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
      {/* --- End Section --- */}

      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-300">b. Text Prompt</h3>
        <p className="text-sm text-gray-400 mb-4">Clearly describe the icon you want to create, e.g., "a futuristic robot cat" or "a minimalist icon of a smiling sun".</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cute, minimalist icon of a robot cat"
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={!isReady || isLoading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <WandIcon className="w-5 h-5" />
            Generate Icon
          </>
        )}
      </button>
    </div>
  );
};
