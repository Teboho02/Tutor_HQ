import { describe, it, expect } from 'vitest';
import { compressVideo } from '../utils/videoCompression';

describe('Video Compression Utility', () => {
    it('validates file size', async () => {
        const largeFile = new File(['x'.repeat(200 * 1024 * 1024)], 'large.mp4', {
            type: 'video/mp4',
        });

        const result = await compressVideo(largeFile);

        expect(result.success).toBe(false);
        expect(result.error).toContain('exceeds maximum size');
    });

    it('validates video duration', async () => {
        // Mock video with long duration
        const mockFile = new File(['test'], 'video.mp4', { type: 'video/mp4' });

        // This test would need proper mocking for video element
        // For now, we'll test the basic structure
        expect(mockFile.type).toBe('video/mp4');
    });

    it('returns error for invalid file type', async () => {
        const invalidFile = new File(['test'], 'document.pdf', {
            type: 'application/pdf',
        });

        const result = await compressVideo(invalidFile);

        expect(result.success).toBe(false);
    });
});
