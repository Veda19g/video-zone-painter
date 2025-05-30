
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Video } from 'lucide-react';
import { toast } from 'sonner';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        onVideoUpload(file);
      } else {
        toast.error('Please select a video file');
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onVideoUpload(file);
    } else {
      toast.error('Please drop a video file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card
      className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4">
            <Video className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Video File
        </h3>
        <p className="text-gray-600 mb-6">
          Drag and drop your video file here, or click to browse
        </p>
        <Button className="inline-flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Choose Video File
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Supports MP4, WebM, AVI, and other video formats
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  );
};

export default VideoUpload;
