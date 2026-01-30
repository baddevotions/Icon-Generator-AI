
import React from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface IconDisplayProps {
  generatedIcon: string | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-64 h-64 bg-gray-700/50 rounded-lg animate-pulse mb-4"></div>
    <h3 className="text-lg font-semibold text-gray-300">Generating your icon...</h3>
    <p className="text-sm text-gray-500">The AI is warming up. This might take a moment.</p>
  </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
      <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-400">Your generated icon will appear here</h3>
      <p className="text-sm text-gray-500 mt-1">Upload your style images and write a prompt to get started.</p>
    </div>
);

const ErrorState: React.FC<{ message: string; onReset: () => void }> = ({ message, onReset }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
      <svg className="w-12 h-12 text-red-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-red-300">Generation Failed</h3>
      <p className="text-sm text-red-400 mt-1 max-w-md">{message}</p>
      <button
        onClick={onReset}
        className="mt-6 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
      >
        Try Again
      </button>
    </div>
);

export const IconDisplay: React.FC<IconDisplayProps> = ({ generatedIcon, isLoading, error, onReset }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">3. Result</h2>
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-900/70 rounded-lg min-h-[300px] md:min-h-[400px]">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onReset={onReset} />
        ) : generatedIcon ? (
          <div className="text-center">
            <img 
              src={generatedIcon} 
              alt="Generated Icon" 
              className="max-w-full max-h-80 object-contain rounded-lg shadow-2xl shadow-indigo-900/50"
            />
            <div className="mt-6 flex gap-4 justify-center">
                <a 
                    href={generatedIcon} 
                    download="generated-icon.png"
                    className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-500 transition-colors"
                >
                    Download
                </a>
                <button
                    onClick={onReset}
                    className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-500 transition-colors"
                >
                    Start Over
                </button>
            </div>
          </div>
        ) : (
          <InitialState />
        )}
      </div>
    </div>
  );
};
