'use client';

import { useState } from 'react';
import { FiUpload, FiFile, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface FileUploadProps {
  onUpload: (file: File) => Promise<any>;
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  successMessage?: string;
  endpoint?: string;
}

export default function FileUpload({
  onUpload,
  accept = '.xlsx,.xls',
  maxSizeMB = 10,
  title = 'Upload Excel File',
  successMessage = 'File successfully processed',
  endpoint = ''
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check file size
    if (selectedFile.size > maxSizeBytes) {
      setUploadResult({
        success: false,
        message: `File size exceeds the maximum limit of ${maxSizeMB}MB.`
      });
      return;
    }

    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!accept.includes(`.${fileExtension}`)) {
      setUploadResult({
        success: false,
        message: `Invalid file type. Please upload ${accept.replace(/,/g, ' or ')} files.`
      });
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadResult(null);
      
      const result = await onUpload(file);
      
      setUploadResult({
        success: true,
        message: successMessage,
        details: result
      });
      
      // Reset file after successful upload
      setFile(null);
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || 'Failed to upload file',
        details: error
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDirectUpload = async () => {
    if (!file || !endpoint) return;
    
    try {
      setIsUploading(true);
      setUploadResult(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const result = await response.json();
      
      setUploadResult({
        success: true,
        message: successMessage,
        details: result
      });
      
      // Reset file after successful upload
      setFile(null);
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || 'Failed to upload file',
        details: error
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        } ${file ? 'bg-gray-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your file here, or{' '}
              <label className="text-primary-600 hover:text-primary-500 cursor-pointer">
                browse
                <input
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept} files up to {maxSizeMB}MB
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <FiFile className="h-6 w-6 text-primary-500" />
            <span className="text-sm font-medium">{file.name}</span>
            <button
              type="button"
              className="text-xs text-red-500 hover:text-red-700"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
      
      {file && (
        <button
          type="button"
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
          onClick={endpoint ? handleDirectUpload : handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}
      
      {uploadResult && (
        <div className={`mt-4 p-4 rounded-md ${uploadResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {uploadResult.success ? (
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {uploadResult.message}
              </h3>
              {uploadResult.details && uploadResult.success && (
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {uploadResult.details.message && (
                      <li>{uploadResult.details.message}</li>
                    )}
                    {uploadResult.details.result && (
                      <>
                        <li>Total rows: {uploadResult.details.result.totalRows}</li>
                        <li>Imported: {uploadResult.details.result.imported}</li>
                        {uploadResult.details.result.updated !== undefined && (
                          <li>Updated: {uploadResult.details.result.updated}</li>
                        )}
                        <li>Errors: {uploadResult.details.result.errors}</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}