
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { FileDropzone } from './FileDropzone';
import { Spinner } from './Spinner';
import { DownloadIcon, SparklesIcon, XCircleIcon, TrashIcon, ArchiveIcon } from './icons';
import { ProcessableFile } from '../types';
import FileListItem from './FileListItem';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};

const getFileKey = (file: File) => `${file.name}|${file.size}|${file.lastModified}|${file.type}`;

// The main combined processor component
export const MediaProcessor: React.FC = () => {
  const [files, setFiles] = useState<ProcessableFile[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [addPrefix, setAddPrefix] = useState<boolean>(true);
  const [highQuality, setHighQuality] = useState<boolean>(false);
  const [duplicateFileNames, setDuplicateFileNames] = useState<string[]>([]);
  
  const notificationTimer = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const isAnyVideoProcessing = useMemo(() => files.some(f => f.type === 'video' && f.status === 'processing'), [files]);

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);
  
  useEffect(() => {
    return () => {
        if (notificationTimer.current) {
            clearTimeout(notificationTimer.current);
        }
    };
  }, []);

  // Reset and clean up URLs
  const resetState = useCallback(() => {
    setFiles(currentFiles => {
      currentFiles.forEach(f => {
        if (f.originalPreview) URL.revokeObjectURL(f.originalPreview);
        if (f.processedUrl) URL.revokeObjectURL(f.processedUrl);
      });
      return [];
    });
    setIsBatchProcessing(false);
  }, []);
  
  const hideNotification = useCallback(() => {
    setDuplicateFileNames([]);
  }, []);

  const showDuplicateNotification = useCallback((filenames: string[]) => {
    if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
    }
    setDuplicateFileNames(filenames);
    notificationTimer.current = window.setTimeout(hideNotification, 5000); // Hide after 5 seconds
  }, [hideNotification]);

  const handleNotificationMouseEnter = useCallback(() => {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
      notificationTimer.current = null;
    }
  }, []);

  const handleNotificationMouseLeave = useCallback(() => {
    notificationTimer.current = window.setTimeout(hideNotification, 2000); // Hide after 2 seconds on leave
  }, [hideNotification]);

  // Handle both image and video file selections
  const handleFilesSelect = useCallback((selectedFiles: FileList | File[]) => {
    const filesArray = Array.from(selectedFiles);
    const duplicateNames: string[] = [];
    
    // Using filesRef.current which is always up-to-date
    const existingFileKeys = new Set(filesRef.current.map(pf => getFileKey(pf.file)));
    const addedKeysThisBatch = new Set<string>();
    const newProcessableFiles: ProcessableFile[] = [];

    for (const file of filesArray) {
        if (!['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
            continue; // Skip unsupported
        }

        const key = getFileKey(file);

        if (existingFileKeys.has(key) || addedKeysThisBatch.has(key)) {
            duplicateNames.push(file.name);
        } else {
            addedKeysThisBatch.add(key);
            newProcessableFiles.push({
                id: crypto.randomUUID(),
                file,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                originalPreview: URL.createObjectURL(file),
                processedUrl: null,
                status: 'pending',
                error: null,
                progress: 0,
                outputFilename: '',
            });
        }
    }

    if (newProcessableFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...newProcessableFiles]);
    }

    if (duplicateNames.length > 0) {
        showDuplicateNotification(duplicateNames);
    }
  }, [showDuplicateNotification]);

  // Remove a single file and clean up its URLs
  const removeFile = useCallback((id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove) {
        if (fileToRemove.originalPreview) URL.revokeObjectURL(fileToRemove.originalPreview);
        if (fileToRemove.processedUrl) URL.revokeObjectURL(fileToRemove.processedUrl);
      }
      return prevFiles.filter(f => f.id !== id);
    });
  }, []);
  
  // Single processing function that handles both types
  const processFile = useCallback((id: string) => {
    const fileToProcess = filesRef.current.find(f => f.id === id);
    if (!fileToProcess) return Promise.resolve();

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'processing' } : f));
    
    return new Promise<void>((resolve) => {
      if (fileToProcess.type === 'image') {
        // Image processing logic
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Could not get canvas context.' } : f));
              return resolve();
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const processedUrl = URL.createObjectURL(blob);
                  setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', processedUrl } : f));
                } else {
                  setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Failed to create cleaned image.' } : f));
                }
                resolve();
              },
              fileToProcess.file.type,
              highQuality ? 1.0 : 0.95
            );
          };
          img.onerror = () => {
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Could not load image.' } : f));
            resolve();
          }
          img.src = e.target?.result as string;
        };
        reader.onerror = () => {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Could not read file.' } : f));
          resolve();
        }
        reader.readAsDataURL(fileToProcess.file);
      } else { // Video processing logic
        let targetMimeType = 'video/webm';
        let determinedExtension: 'mp4' | 'webm' = 'webm';
        if (['video/mp4', 'video/quicktime'].includes(fileToProcess.file.type) && MediaRecorder.isTypeSupported('video/mp4')) {
            targetMimeType = 'video/mp4';
            determinedExtension = 'mp4';
        }
        
        const nameWithoutExt = fileToProcess.file.name.substring(0, fileToProcess.file.name.lastIndexOf('.')) || 'video';
        const finalName = addPrefix ? `cleaned_${nameWithoutExt}` : nameWithoutExt;
        const outputFilename = `${finalName}.${determinedExtension}`;

        setFiles(prev => prev.map(f => f.id === id ? { ...f, outputFilename } : f));

        const sourceVideo = document.createElement('video');
        sourceVideo.src = fileToProcess.originalPreview;
        sourceVideo.muted = true;
        sourceVideo.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = sourceVideo.videoWidth;
          canvas.height = sourceVideo.videoHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Canvas not supported.' } : f));
            return resolve();
          }
          
          const originalStream = (sourceVideo as any).captureStream ? (sourceVideo as any).captureStream() : (sourceVideo as any).mozCaptureStream ? (sourceVideo as any).mozCaptureStream() : null;
          if (!originalStream) {
              setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Video stream capture not supported.' } : f));
              return resolve();
          }
          
          const audioTracks = originalStream.getAudioTracks();
          const canvasStream = canvas.captureStream(30);
          const videoTrack = canvasStream.getVideoTracks()[0];
          const finalStream = new MediaStream([videoTrack, ...audioTracks]);

          const recordedChunks: Blob[] = [];
          const recorderOptions: MediaRecorderOptions = { mimeType: targetMimeType };
          if (highQuality) {
              recorderOptions.videoBitsPerSecond = 20000000;
          }
          const recorder = new MediaRecorder(finalStream, recorderOptions);

          recorder.ondataavailable = e => e.data.size > 0 && recordedChunks.push(e.data);
          recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: targetMimeType });
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', processedUrl: URL.createObjectURL(blob), progress: 100 } : f));
            resolve();
          };
          recorder.start();

          const drawFrame = () => {
            if (sourceVideo.paused || sourceVideo.ended) return;
            ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
            setFiles(prev => prev.map(f => {
                if (f.id === id) {
                    return { ...f, progress: (sourceVideo.currentTime / sourceVideo.duration) * 100 };
                }
                return f;
            }));
            requestAnimationFrame(drawFrame);
          };
          
          sourceVideo.play().catch(e => {
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: `Playback error: ${e.message}` } : f));
            resolve();
          });
          drawFrame();
          sourceVideo.onended = () => recorder.stop();
        };
        sourceVideo.onerror = () => {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: 'Could not load video file.' } : f));
          resolve();
        };
      }
    });
  }, [addPrefix, highQuality]);

  // Process all pending files
  const processAll = async () => {
    setIsBatchProcessing(true);
    // Use filesRef.current to process the state at the time of invocation
    for (const file of filesRef.current) {
      if (file.status === 'pending') {
        await processFile(file.id);
      }
    }
    setIsBatchProcessing(false);
  };

  // Download all finished files as a single ZIP
  const downloadAllAsZip = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.processedUrl);
    if (doneFiles.length === 0) return;

    setIsZipping(true);
    try {
        const zip = new JSZip();
        
        const filePromises = doneFiles.map(async (fileToZip) => {
            const response = await fetch(fileToZip.processedUrl!);
            const blob = await response.blob();
            const filename = fileToZip.type === 'image'
              ? (addPrefix ? `cleaned_${fileToZip.file.name}` : fileToZip.file.name)
              : fileToZip.outputFilename;
            zip.file(filename, blob);
        });

        await Promise.all(filePromises);

        const content = await zip.generateAsync({ type: 'blob' });
        
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timestamp = `${day}-${month}_${hours}-${minutes}`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `cleaned_media_${timestamp}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Error creating ZIP file", error);
    } finally {
        setIsZipping(false);
    }
  };
  
  const pendingFilesCount = useMemo(() => files.filter(f => f.status === 'pending').length, [files]);
  const doneFilesCount = useMemo(() => files.filter(f => f.status === 'done').length, [files]);

  // The main JSX for the component
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Batch Media Processor</h2>
        <p className="mt-1 text-slate-400">Upload JPG/PNG images or MP4/MOV videos. Metadata is removed in your browser for privacy.</p>
        <div className="mt-2 p-3 text-sm bg-amber-100/10 border border-amber-400/20 text-orange-200 rounded-lg">
            <p><strong>Note:</strong> Video processing can be slow and re-encodes the file. MOV files are converted to MP4 or WEBM.</p>
            <p className="mt-2">The "Add 'cleaned_' prefix" option applies to videos during processing and cannot be changed afterward for that file.</p>
        </div>
      </div>
      
      <div className="relative">
        <FileDropzone
            onFilesSelect={handleFilesSelect}
            accept="image/jpeg, image/png, image/jpg, video/mp4, video/quicktime, video/webm"
            title="Drag & drop images or videos here, or click to select"
        />
        {duplicateFileNames.length > 0 && (
          <div 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-sm px-4 py-3 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg shadow-lg transition-opacity duration-300"
            role="alert"
            aria-live="assertive"
            onMouseEnter={handleNotificationMouseEnter}
            onMouseLeave={handleNotificationMouseLeave}
          >
            <p className="font-semibold text-base">Duplicate file{duplicateFileNames.length > 1 ? 's' : ''} ignored</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                {duplicateFileNames.slice(0, 3).map((name, index) => (
                    <li key={`${name}-${index}`} className="truncate" title={name}>{name}</li>
                ))}
            </ul>
            {duplicateFileNames.length > 3 && (
                <p className="text-xs mt-2 text-slate-400">...and {duplicateFileNames.length - 3} more.</p>
            )}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">{files.length} File(s) Queued</h3>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="addPrefix" name="addPrefix" checked={addPrefix} onChange={(e) => setAddPrefix(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-600 cursor-pointer"/>
                            <label htmlFor="addPrefix" className="text-sm text-slate-300 cursor-pointer">Add "cleaned_" prefix to filename</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="highQuality" name="highQuality" checked={highQuality} onChange={(e) => setHighQuality(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-600 cursor-pointer"/>
                            <label htmlFor="highQuality" className="text-sm text-slate-300 cursor-pointer">Process with higher quality (larger file size)</label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-wrap justify-end gap-2">
                    <button onClick={resetState} disabled={isBatchProcessing || isZipping} className="inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Clear All
                    </button>
                    <button onClick={processAll} disabled={isBatchProcessing || isZipping || pendingFilesCount === 0 || (isMobile && isAnyVideoProcessing)} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <SparklesIcon className="mr-2 h-5 w-5" />
                        {isBatchProcessing ? 'Processing...' : `Process ${pendingFilesCount} File(s)`}
                    </button>
                    <button onClick={downloadAllAsZip} disabled={isBatchProcessing || isZipping || doneFilesCount === 0} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <ArchiveIcon className="mr-2 h-5 w-5" />
                        {isZipping ? 'Zipping...' : `Download ${doneFilesCount} File(s)`}
                    </button>
                </div>
            </div>
            <div className="space-y-3">
              {files.map(mediaFile => (
                <FileListItem
                  key={mediaFile.id}
                  mediaFile={mediaFile}
                  onProcess={processFile}
                  onRemove={removeFile}
                  isBatchJobRunning={isBatchProcessing || isZipping}
                  addPrefix={addPrefix}
                  disableVideoProcessing={isMobile && isAnyVideoProcessing}
                />
              ))}
            </div>
        </div>
      )}
    </div>
  );
};
