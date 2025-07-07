import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  maxWidth?: number; // in pixels
  maxHeight?: number; // in pixels
  currentImageUrl?: string;
  label: string;
  description?: string;
  required?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxWidth = 2048,
  maxHeight = 2048,
  currentImageUrl,
  label,
  description,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateImage = useCallback(
    (file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        if (file.size > maxSize) {
          setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
          resolve(false);
          return;
        }

        const img = new Image();
        img.onload = () => {
          if (img.width > maxWidth || img.height > maxHeight) {
            setError(
              `Image dimensions must be less than ${maxWidth}x${maxHeight}px. Current: ${img.width}x${img.height}px`
            );
            resolve(false);
          } else {
            setError(null);
            resolve(true);
          }
        };
        img.onerror = () => {
          setError('Invalid image file');
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      });
    },
    [maxSize, maxWidth, maxHeight]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const isValid = await validateImage(file);

      if (isValid) {
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
      setUploading(false);
    },
    [onFileSelect, validateImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
    disabled: uploading,
  });

  const removeImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && '*'}
      </label>

      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-400' : ''}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 max-w-full rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click or drag to replace image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {uploading ? (
              <div className="text-green-600 dark:text-green-400">
                <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <div className="text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Click to upload
                  </span>
                  <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
                  <br />
                  Max dimensions: {maxWidth}x{maxHeight}px
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FileDropzone;
