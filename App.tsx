
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { IconDisplay } from './components/IconDisplay';
import { generateIconFromIllustrations } from './services/geminiService';
import type { UploadedImage } from './types';

function App() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [contentImage, setContentImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt || uploadedImages.length === 0) {
      setError('Please upload at least one image and provide a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedIcon(null);

    try {
      const imageFiles = uploadedImages.map(img => img.file);
      const iconDataUrl = await generateIconFromIllustrations(imageFiles, prompt, contentImage?.file);
      setGeneratedIcon(iconDataUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImages, contentImage]);

  const handleReset = () => {
    setUploadedImages([]);
    setPrompt('');
    setGeneratedIcon(null);
    setError(null);
    setIsLoading(false);
    setContentImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <ImageUploader uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
            <PromptControls 
              prompt={prompt} 
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              isReady={prompt.length > 0 && uploadedImages.length > 0}
              contentImage={contentImage}
              setContentImage={setContentImage}
            />
          </div>

          {/* Right Column: Display */}
          <div className="flex flex-col bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <IconDisplay 
              generatedIcon={generatedIcon}
              isLoading={isLoading}
              error={error}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
