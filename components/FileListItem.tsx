import React from 'react';
import { ProcessableFile } from '../types';
import { Spinner } from './Spinner';
import { DownloadIcon, SparklesIcon, XCircleIcon } from './icons';

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

interface FileListItemProps {
  mediaFile: ProcessableFile;
  onProcess: (id: string) => void;
  onRemove: (id: string) => void;
  isBatchJobRunning: boolean;
  addPrefix: boolean;
}

const FileListItem: React.FC<FileListItemProps> = ({
  mediaFile,
  onProcess,
  onRemove,
  isBatchJobRunning,
  addPrefix,
}) => {
  const { id, file, status, error, processedUrl, originalPreview, type, progress, outputFilename } = mediaFile;
  
  const downloadFilename = type === 'image'
      ? (addPrefix ? `cleaned_${file.name}` : file.name)
      : outputFilename;
  
  return (
    <div className="bg-slate-700/50 p-3 rounded-lg flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {type === 'image' ? (
            <img src={originalPreview} alt={file.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
        ) : (
            <video src={originalPreview} muted playsInline className="w-16 h-16 object-cover rounded-md bg-black flex-shrink-0" />
        )}
        <div className="flex-grow text-center sm:text-left w-full sm:w-auto">
            <p className="font-medium text-slate-200 truncate" title={file.name}>{file.name}</p>
            <p className="text-sm text-slate-400">{formatBytes(file.size)}</p>
            {type === 'video' && status === 'processing' && (
                <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                    <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2">
            {status === 'pending' && <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full">Pending</span>}
            {status === 'processing' && type === 'image' && <Spinner />}
            {status === 'processing' && type === 'video' && <span className="text-xs font-medium text-sky-300">{Math.round(progress)}%</span>}
            {status === 'done' && <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Done</span>}
            {status === 'error' && <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-full" title={error || ''}>Error</span>}
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2">
            {status === 'pending' && (
                <button 
                    onClick={() => onProcess(id)} 
                    disabled={isBatchJobRunning}
                    className="p-2 text-sky-400 hover:text-sky-300 hover:bg-slate-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Process this file"
                >
                    <SparklesIcon className="h-5 w-5" />
                </button>
            )}
            {status === 'done' && processedUrl && (
                <a href={processedUrl} download={downloadFilename} className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded-full transition-colors" title="Download cleaned file"><DownloadIcon className="h-5 w-5" /></a>
            )}
            <button 
                onClick={() => onRemove(id)} 
                disabled={status === 'processing' || isBatchJobRunning}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove file"
            >
                <XCircleIcon className="h-5 w-5" />
            </button>
        </div>
    </div>
  );
};

export default React.memo(FileListItem);
