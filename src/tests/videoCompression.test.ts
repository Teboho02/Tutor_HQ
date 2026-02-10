import { describe, it, expect } from 'vitest';
import { VideoCompressor, COMPRESSION_PRESETS } from '../utils/videoCompression';

describe('Video Compression Utility', () => {
    it('creates VideoCompressor instance', () => {
        const compressor = new VideoCompressor();
        expect(compressor).toBeInstanceOf(VideoCompressor);
    });

    it('has compression presets defined', () => {
        expect(COMPRESSION_PRESETS).toBeDefined();
        expect(COMPRESSION_PRESETS.HD).toBeDefined();
        expect(COMPRESSION_PRESETS.Standard).toBeDefined();
        expect(COMPRESSION_PRESETS.High).toBeDefined();
        expect(COMPRESSION_PRESETS.Mobile).toBeDefined();
    });

    it('creates VideoCompressor with custom config', () => {
        const compressor = new VideoCompressor({
            targetBitrate: '500k',
            targetResolution: '640x480',
            preset: 'fast'
        });
        expect(compressor).toBeInstanceOf(VideoCompressor);
    });

    it('supports progress callback', () => {
        const compressor = new VideoCompressor();
        const callback = compressor.onProgress(() => { });
        expect(callback).toBe(compressor);
    });
});
