import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types/test';
import './FileUpload.css';

interface FileUploadProps {
    allowedTypes?: string[]; // e.g., ['.pdf', '.docx', '.jpg', '.png']
    maxFileSize?: number; // in MB
    maxFiles?: number;
    onFilesChange: (files: File[]) => void;
    existingFiles?: UploadedFile[];
}

const FileUpload: React.FC<FileUploadProps> = ({
    allowedTypes = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'],
    maxFileSize = 10, // 10MB default
    maxFiles = 5,
    onFilesChange,
    existingFiles = [],
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        // Check file size
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxFileSize) {
            return `File "${file.name}" exceeds maximum size of ${maxFileSize}MB`;
        }

        // Check file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            return `File type "${fileExtension}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
        }

        return null;
    };

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        setError('');
        const fileArray = Array.from(newFiles);
        const validFiles: File[] = [];
        let errorMessage = '';

        // Check total file count
        if (files.length + fileArray.length + existingFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Validate each file
        for (const file of fileArray) {
            const validationError = validateFile(file);
            if (validationError) {
                errorMessage += validationError + '\n';
            } else {
                validFiles.push(file);
            }
        }

        if (errorMessage) {
            setError(errorMessage.trim());
        }

        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles];
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
        setError('');
    };

    const getFileIcon = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            case 'zip':
            case 'rar':
                return '🗜️';
            default:
                return '📎';
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="file-upload-container">
            <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleChange}
                    accept={allowedTypes.join(',')}
                    className="file-input"
                />
                <div className="drop-zone-content">
                    <span className="upload-icon">📤</span>
                    <p className="drop-zone-text">
                        <strong>Drag and drop files here</strong> or click to browse
                    </p>
                    <p className="drop-zone-info">
                        Allowed: {allowedTypes.join(', ')} • Max size: {maxFileSize}MB • Max files: {maxFiles}
                    </p>
                </div>
            </div>

            {error && (
                <div className="upload-error">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            )}

            {(files.length > 0 || existingFiles.length > 0) && (
                <div className="files-list">
                    <h4>Uploaded Files ({files.length + existingFiles.length}/{maxFiles})</h4>

                    {/* Existing files (already uploaded) */}
                    {existingFiles.map(file => (
                        <div key={file.id} className="file-item existing">
                            <span className="file-icon">{getFileIcon(file.name)}</span>
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <span className="file-status uploaded">✓ Uploaded</span>
                        </div>
                    ))}

                    {/* New files (to be uploaded) */}
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            <span className="file-icon">{getFileIcon(file.name)}</span>
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button
                                className="remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                title="Remove file"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
