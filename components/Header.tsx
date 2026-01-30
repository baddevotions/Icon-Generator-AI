
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-gray-700/50">
      <div className="container mx-auto flex items-center gap-4">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Icon Generator AI</h1>
            <p className="text-sm text-gray-400">Create unique icons from your own illustration style.</p>
        </div>
      </div>
    </header>
  );
};
