export interface ProcessableFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  originalPreview: string;
  processedUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error: string | null;
  progress: number; // For video processing progress
  outputFilename: string; // For final video filename
}
