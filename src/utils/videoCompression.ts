/**
 * Video Compression Utility
 * 
 * Compresses video files before upload to reduce storage and bandwidth requirements.
 * Supports 1-hour videos with configurable compression settings.
 * 
 * NOTE: Full backend implementation will be merged later. This is the frontend system.
 * Current implementation uses FFmpeg.wasm for browser-side compression.
 * 
 * REQUIREMENTS FOR FULL SYSTEM:
 * - Backend API endpoint to accept compressed video + metadata
 * - Supabase storage bucket configuration for video files
 * - CDN setup for video delivery
 * - Progress tracking for upload
 * - Error recovery and retry logic
 */

export interface CompressionConfig {
    targetBitrate?: string; // e.g., '500k', '1000k', '2000k' - default: '1000k'
    targetResolution?: string; // e.g., '1280x720', '1920x1080' - default: '1280x720'
    format?: 'mp4' | 'webm' | 'avi'; // default: 'mp4'
    preset?: 'fast' | 'medium' | 'slow'; // compression speed/quality tradeoff - default: 'medium'
    maxDuration?: number; // max video duration in seconds (e.g., 3600 for 1 hour)
}

export interface CompressionProgress {
    status: 'idle' | 'analyzing' | 'compressing' | 'complete' | 'error';
    progress: number; // 0-100
    currentFrame?: number;
    totalFrames?: number;
    estimatedTimeRemaining?: number; // in seconds
    error?: string;
    originalSize: number; // in bytes
    compressedSize?: number; // in bytes
    compressionRatio?: number; // compressedSize / originalSize
}

export interface VideoCompressionResult {
    success: boolean;
    compressedBlob?: Blob;
    compressedFile?: File;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    duration: number; // in seconds
    metadata: {
        width: number;
        height: number;
        bitrate: string;
        format: string;
    };
    error?: string;
}

export interface CompressionPreset {
    name: string;
    description: string;
    bitrate: string;
    resolution: string;
    preset: 'fast' | 'medium' | 'slow';
    estimatedFileSize: number; // MB for 1 hour video
}

/**
 * Predefined compression presets
 * These provide quick options for different use cases
 */
export const COMPRESSION_PRESETS: Record<string, CompressionPreset> = {
    'HD': {
        name: 'HD Quality (Recommended)',
        description: '720p, 1000 kbps - Good quality with reasonable file size',
        bitrate: '1000k',
        resolution: '1280x720',
        preset: 'medium',
        estimatedFileSize: 450, // ~450MB for 1 hour
    },
    'Standard': {
        name: 'Standard Quality',
        description: '480p, 500 kbps - Lower quality, smaller file',
        bitrate: '500k',
        resolution: '854x480',
        preset: 'fast',
        estimatedFileSize: 225, // ~225MB for 1 hour
    },
    'High': {
        name: 'High Quality',
        description: '1080p, 2000 kbps - Best quality, larger file',
        bitrate: '2000k',
        resolution: '1920x1080',
        preset: 'slow',
        estimatedFileSize: 900, // ~900MB for 1 hour
    },
    'Mobile': {
        name: 'Mobile Optimized',
        description: '360p, 300 kbps - Ultra compact for mobile',
        bitrate: '300k',
        resolution: '640x360',
        preset: 'fast',
        estimatedFileSize: 135, // ~135MB for 1 hour
    }
};

/**
 * Browser-side video compression using FFmpeg.wasm
 * 
 * NOTE: This is a placeholder implementation.
 * Actual FFmpeg.wasm integration will:
 * 1. Load FFmpeg WASM module (async, ~30MB)
 * 2. Transcode video in browser worker
 * 3. Return compressed Blob for upload
 * 
 * DEPENDENCIES NEEDED:
 * - npm install @ffmpeg/ffmpeg @ffmpeg/util
 * - CDN: <script src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js"></script>
 */
export class VideoCompressor {
    private progressCallback?: (progress: CompressionProgress) => void;
    private config: CompressionConfig;

    constructor(config: CompressionConfig = {}) {
        this.config = {
            targetBitrate: config.targetBitrate || '1000k',
            targetResolution: config.targetResolution || '1280x720',
            format: config.format || 'mp4',
            preset: config.preset || 'medium',
            maxDuration: config.maxDuration || 3600, // 1 hour
        };
    }

    /**
     * Set progress callback for UI updates
     */
    onProgress(callback: (progress: CompressionProgress) => void) {
        this.progressCallback = callback;
        return this;
    }

    /**
     * Get file size in human readable format
     */
    private formatFileSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size > 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    /**
     * Validate video file before compression
     */
    private validateFile(file: File): { valid: boolean; error?: string } {
        const maxSizeMB = 2000; // 2GB max
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid video format. Allowed: MP4, WebM, MOV, AVI. Got: ${file.type}`
            };
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            return {
                valid: false,
                error: `File too large. Maximum: ${maxSizeMB}MB. Got: ${this.formatFileSize(file.size)}`
            };
        }

        return { valid: true };
    }

    /**
     * Compress video file
     * 
     * IMPLEMENTATION NOTES:
     * 1. This method will use FFmpeg.wasm in the actual implementation
     * 2. Compression happens in a Web Worker to avoid blocking UI
     * 3. Progress updates sent via postMessage
     * 4. Returns compressed Blob ready for upload
     * 
     * EXAMPLE FFMPEG COMMAND (for reference):
     * ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 1000k -preset medium output.mp4
     * 
     * @param file Video file to compress
     * @returns Promise with compression result
     */
    async compress(file: File): Promise<VideoCompressionResult> {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            return {
                success: false,
                originalSize: file.size,
                compressedSize: 0,
                compressionRatio: 0,
                error: validation.error,
                duration: 0,
                metadata: {
                    width: 0,
                    height: 0,
                    bitrate: '',
                    format: ''
                }
            };
        }

        // Update progress
        this.updateProgress({
            status: 'analyzing',
            progress: 10,
            originalSize: file.size
        });

        try {
            /**
             * PLACEHOLDER: Actual compression logic
             * 
             * Real implementation will:
             * 1. Initialize FFmpeg if not already done
             * 2. Load file into FFmpeg
             * 3. Execute transcode command
             * 4. Extract output as Blob
             * 5. Return result with metadata
             */

            // Simulated compression (remove in production)
            const compressedSize = Math.floor(file.size * 0.5); // Assume 50% reduction

            this.updateProgress({
                status: 'compressing',
                progress: 50,
                originalSize: file.size,
                compressedSize,
                compressionRatio: compressedSize / file.size
            });

            // Simulate compression time
            await this.delay(1000);

            // Get video duration (would use FFmpeg probe in real implementation)
            const duration = 3600; // 1 hour default

            this.updateProgress({
                status: 'complete',
                progress: 100,
                originalSize: file.size,
                compressedSize,
                compressionRatio: compressedSize / file.size
            });

            return {
                success: true,
                compressedBlob: new Blob([], { type: 'video/mp4' }),
                originalSize: file.size,
                compressedSize,
                compressionRatio: compressedSize / file.size,
                duration,
                metadata: {
                    width: parseInt(this.config.targetResolution!.split('x')[0]),
                    height: parseInt(this.config.targetResolution!.split('x')[1]),
                    bitrate: this.config.targetBitrate!,
                    format: this.config.format!
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown compression error';
            this.updateProgress({
                status: 'error',
                progress: 0,
                error: errorMessage,
                originalSize: file.size
            });

            return {
                success: false,
                originalSize: file.size,
                compressedSize: 0,
                compressionRatio: 0,
                error: errorMessage,
                duration: 0,
                metadata: {
                    width: 0,
                    height: 0,
                    bitrate: '',
                    format: ''
                }
            };
        }
    }

    /**
     * Get recommended compression settings based on video characteristics
     */
    getRecommendedSettings(fileSize: number, estimatedDuration: number): CompressionConfig {
        const sizeMB = fileSize / (1024 * 1024);
        const sizePerMinute = sizeMB / (estimatedDuration / 60);

        if (sizePerMinute > 50) {
            // Large files, aggressive compression
            return {
                targetBitrate: '500k',
                targetResolution: '854x480',
                preset: 'fast'
            };
        } else if (sizePerMinute > 20) {
            // Medium files, standard compression
            return {
                targetBitrate: '1000k',
                targetResolution: '1280x720',
                preset: 'medium'
            };
        } else {
            // Small files, minimal compression
            return {
                targetBitrate: '2000k',
                targetResolution: '1920x1080',
                preset: 'slow'
            };
        }
    }

    /**
     * Update progress and call callback
     */
    private updateProgress(progress: CompressionProgress) {
        if (this.progressCallback) {
            this.progressCallback(progress);
        }
    }

    /**
     * Helper delay function for async operations
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Upload compressed video to backend
 * 
 * BACKEND REQUIREMENTS:
 * - Endpoint: POST /api/upload/video
 * - Accepts: FormData with compressed video blob + metadata
 * - Returns: { success: boolean; url: string; videoId: string; }
 * 
 * @param compressedBlob Compressed video blob from VideoCompressor
 * @param fileName Original file name
 * @param metadata Video metadata (bitrate, resolution, etc.)
 * @returns Promise with upload result
 */
export async function uploadCompressedVideo(
    compressedBlob: Blob,
    fileName: string,
    metadata: {
        width: number;
        height: number;
        bitrate: string;
        format: string;
        originalFileName: string;
        compressionRatio: number;
    },
    onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; videoId?: string; error?: string }> {
    /**
     * PLACEHOLDER: Actual upload implementation
     * 
     * Real implementation will:
     * 1. Create FormData with video blob + metadata
     * 2. Make POST request to backend
     * 3. Track upload progress
     * 4. Handle errors and retries
     * 5. Return signed URL from Supabase
     */

    try {
        const formData = new FormData();
        formData.append('video', compressedBlob, fileName);
        formData.append('metadata', JSON.stringify(metadata));

        // Simulate upload
        for (let i = 0; i <= 100; i += 20) {
            if (onProgress) onProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return {
            success: true,
            url: 'https://example.com/videos/uploaded-video.mp4',
            videoId: `video_${Date.now()}`
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
}

/**
 * SYSTEM ARCHITECTURE NOTES:
 * 
 * COMPONENTS NEEDED:
 * 1. VideoUploadComponent - UI for file selection and compression preview
 * 2. CompressionProgressModal - Shows compression progress with ETA
 * 3. VideoPreviewComponent - Shows original vs compressed comparison
 * 
 * DATA FLOW:
 * User selects video
 *   ↓
 * UI shows file size and duration
 *   ↓
 * User selects compression preset (or custom settings)
 *   ↓
 * VideoCompressor.compress() called
 *   ↓
 * Progress updates shown in UI
 *   ↓
 * Compressed blob ready
 *   ↓
 * User confirms upload
 *   ↓
 * uploadCompressedVideo() called
 *   ↓
 * Upload progress shown
 *   ↓
 * Completion with URL
 * 
 * STORAGE CONSIDERATIONS:
 * - Original file: Kept or discarded? (Recommend: discard to save space)
 * - Compressed file: Store in Supabase with metadata
 * - Thumbnails: Generate key frame for video preview
 * - Transcoding: Multiple bitrates for adaptive streaming (future)
 */
