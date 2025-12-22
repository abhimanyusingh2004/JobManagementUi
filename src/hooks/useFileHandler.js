import { useState, useCallback } from 'react';

export const useFileHandler = () => {
  const [files, setFiles] = useState([]);

  const createFileObject = useCallback((file) => {
    const fileObj = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      caption: '', // Display caption (without <tag>)
      internalCaption: '', // Caption with <tag> for mentions
      mentionIds: [], // Array of user IDs for mentions
      preview: null,
      url: null
    };

    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      fileObj.preview = URL.createObjectURL(file);
      fileObj.url = fileObj.preview;
    }

    return fileObj;
  }, []);

  const addFiles = useCallback((newFiles) => {
    const validFiles = newFiles.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      return file.size <= maxSize && allowedTypes.includes(file.type);
    });

    const fileObjects = validFiles.map(createFileObject);
    setFiles(prev => [...prev, ...fileObjects]);
  }, [createFileObject]);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const updateCaption = useCallback((fileId, caption, internalCaption, mentionIds) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, caption, internalCaption, mentionIds } : file
    ));
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  return {
    files,
    addFiles,
    removeFile,
    updateCaption,
    clearFiles
  };
};