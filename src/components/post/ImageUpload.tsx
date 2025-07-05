import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void;
  uploadedImages: File[];
  onRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  uploadedImages, 
  onRemoveImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
    }
    
    if (imageFiles.length > 0) {
      onImageUpload(imageFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onImageUpload(imageFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Or drag and drop your images here
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {uploadedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-24 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => onRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;