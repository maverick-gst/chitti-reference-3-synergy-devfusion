import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { useQueryClient } from '@tanstack/react-query';

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

interface FileUploaderProps {
  productId: string;
  stepId?: number;
  subStepId?: number;
  onFileUpload: () => void;
}

export default function FileUploader({ productId, stepId, subStepId, onFileUpload }: FileUploaderProps) {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    for (const file of selectedFiles) {
      const isDuplicate = await checkForDuplicate(file.name);
      if (isDuplicate) {
        setDuplicateFile(file);
        setShowDuplicateDialog(true);
        return;
      }
    }
  
    setFiles(prevFiles => [
      ...prevFiles,
      ...selectedFiles.map(file => ({ file, status: 'pending' as const, progress: 0 }))
    ]);
  };

  const checkForDuplicate = async (fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/files/check-duplicate?fileName=${encodeURIComponent(fileName)}&productId=${productId}`);
      if (!response.ok) throw new Error('Failed to check for duplicate');
      const data = await response.json();
      return data.isDuplicate;
    } catch (error) {
      console.error('Error checking for duplicate:', error);
      return false;
    }
  };

  const handleReplace = () => {
    if (duplicateFile) {
      setFiles(prevFiles => [
        ...prevFiles,
        { file: duplicateFile, status: 'pending' as const, progress: 0 }
      ]);
    }
    setShowDuplicateDialog(false);
    setDuplicateFile(null);
  };

  const handleSkip = () => {
    setShowDuplicateDialog(false);
    setDuplicateFile(null);
  };

  const updateFileStatus = (index: number, status: FileUploadStatus['status'], progress: number) => {
    setFiles(prevFiles => 
      prevFiles.map((file, i) => 
        i === index ? { ...file, status, progress } : file
      )
    );
  };

  const saveFileMetadata = async (file: File, uploadUrl: string, isDuplicate: boolean) => {
    try {
      const endpoint = `/api/files?fileName=${encodeURIComponent(file.name)}`;
      const method = isDuplicate ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
          url: uploadUrl,
          productId,
          stepId,
          subStepId,
          systemGenerated: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file metadata');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving file metadata:', error);
      throw error;
    }
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      const isDuplicate = await checkForDuplicate(file.name);
      if (isDuplicate) {
        const userConfirmed = window.confirm(`A file named "${file.name}" already exists. Do you want to replace it?`);
        if (!userConfirmed) {
          updateFileStatus(index, 'error', 0);
          return;
        }
      }

      const response = await fetch('/api/files/pre-signed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });

      if (!response.ok) throw new Error('Failed to get upload URL');

      const { uploadUrl } = await response.json();

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          updateFileStatus(index, 'uploading', percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            await saveFileMetadata(file, uploadUrl.split('?')[0], isDuplicate);
            updateFileStatus(index, 'success', 100);
            queryClient.invalidateQueries({ queryKey: ['files', productId] });
            onFileUpload();
          } catch (error) {
            console.error('Error saving file metadata:', error);
            updateFileStatus(index, 'error', 0);
          }
        } else {
          updateFileStatus(index, 'error', 0);
        }
      };

      xhr.onerror = () => {
        updateFileStatus(index, 'error', 0);
      };

      xhr.send(file);
    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(index, 'error', 0);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      await Promise.all(files.map((file, index) => uploadFile(file.file, index)));
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // New function to clear all selected files
  const clearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                aria-label="Select files to upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
              >
                <Upload size={20} className="mr-2" />
                Select Files
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="ml-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-colors duration-300"
              >
                {uploading ? (
                  <>
                    <Loader size={20} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
            {files.length > 0 && (
              <Button
                onClick={clearAllFiles}
                variant="ghost"
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                Clear All
              </Button>
            )}
          </div>
          <AnimatePresence>
            {files.length > 0 && (
              <motion.ul
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {files.map((file, index) => (
                  <motion.li
                    key={index}
                    className="bg-white bg-opacity-50 rounded-lg p-3 flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center flex-grow mr-4">
                      <span className="font-medium text-blue-800 truncate max-w-xs">
                        {file.file.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({(file.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    {file.status === 'pending' && (
                      <Button
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={20} />
                      </Button>
                    )}
                    {file.status === 'uploading' && (
                      <div className="w-1/3">
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}
                    {file.status === 'success' && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg border border-blue-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center">
              <AlertCircle className="mr-2" size={24} />
              Duplicate File Detected
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              A file with the name "{duplicateFile?.name}" already exists. Do you want to replace it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Skip
            </Button>
            <Button
              onClick={handleReplace}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-colors duration-300"
            >
              Replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
