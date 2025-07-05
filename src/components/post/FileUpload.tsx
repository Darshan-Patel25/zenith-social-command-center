import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File, FileText, Music, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
  onRemoveFile: (index: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  uploadedFiles, 
  onRemoveFile 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <File className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const decimals = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Check file size (max 10MB per file)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Or drag and drop your files here (Max 10MB each)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => onRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;