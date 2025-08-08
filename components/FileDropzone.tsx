/// <reference lib="dom" />

import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloudIcon } from './icons';

interface FileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  accept: string;
  title: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesSelect, accept, title }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const acceptedMimeTypes = accept.split(',').map(s => s.trim().toLowerCase());
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && acceptedMimeTypes.includes(item.type.toLowerCase())) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      event.preventDefault();
      onFilesSelect(files);
    }
  }, [accept, onFilesSelect]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files));
    }
  }, [onFilesSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files));
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="mt-6">
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          flex justify-center w-full px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragOver ? 'border-sky-500 bg-slate-700/50' : 'border-slate-600 hover:border-sky-600'}
        `}
      >
        <div className="space-y-1 text-center">
          <UploadCloudIcon className={`mx-auto h-12 w-12 ${isDragOver ? 'text-sky-400' : 'text-slate-500'}`} />
          <div className="flex text-sm text-slate-400">
            <p className="pl-1">{title}</p>
          </div>
          <p className="text-xs text-slate-500">or paste from clipboard</p>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept={accept} onChange={handleFileChange} multiple />
        </div>
      </label>
    </div>
  );
};