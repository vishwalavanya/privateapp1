import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

interface PhotoPickerProps {
  onImageSelect: (file: File) => void;
}

function PhotoPicker({ onImageSelect }: PhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                   p-3 rounded-2xl hover:from-green-600 hover:to-emerald-600 
                   transform hover:scale-105 transition-all duration-200 
                   shadow-lg hover:shadow-xl"
        title="Send image"
      >
        <Plus className="w-5 h-5" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

export default PhotoPicker;