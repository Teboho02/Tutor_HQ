import apiClient from '../config/api';

export type MaterialType = 'pdf' | 'video' | 'doc' | 'link' | 'image' | 'audio' | 'slides';

export interface Material {
    id: string;
    title: string;
    description: string;
    class_id: string;
    tutor_id: string;
    type: MaterialType;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    duration?: number;
    external_url?: string;
    downloads: number;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
    classes?: {
        id: string;
        title: string;
        subject: string;
    };
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface CreateMaterialData {
    title: string;
    description?: string;
    classId: string;
    type: MaterialType;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    externalUrl?: string;
}

export interface UpdateMaterialData {
    title?: string;
    description?: string;
    status?: 'draft' | 'published' | 'archived';
}

export const materialService = {
    /**
     * Create a new material (Tutor only)
     */
    async createMaterial(data: CreateMaterialData) {
        const response = await apiClient.post('/materials', data);
        return response.data;
    },

    /**
     * Get material details
     */
    async getMaterial(materialId: string) {
        const response = await apiClient.get(`/materials/${materialId}`);
        return response.data;
    },

    /**
     * Get materials for a specific class (Tutor)
     */
    async getClassMaterials(classId: string) {
        const response = await apiClient.get(`/materials/class/${classId}`);
        return response.data;
    },

    /**
     * Get all tutor's materials
     */
    async getTutorMaterials() {
        const response = await apiClient.get('/materials/tutor/all');
        return response.data;
    },

    /**
     * Get student's accessible materials
     */
    async getStudentMaterials(studentId: string) {
        const response = await apiClient.get(`/materials/student/${studentId}`);
        return response.data;
    },

    /**
     * Update material (Tutor only)
     */
    async updateMaterial(materialId: string, data: UpdateMaterialData) {
        const response = await apiClient.patch(`/materials/${materialId}`, data);
        return response.data;
    },

    /**
     * Delete material (Tutor only)
     */
    async deleteMaterial(materialId: string) {
        const response = await apiClient.delete(`/materials/${materialId}`);
        return response.data;
    },

    /**
     * Track material download
     */
    async trackDownload(materialId: string) {
        const response = await apiClient.post(`/materials/${materialId}/download`);
        return response.data;
    },

    /**
     * Upload file
     */
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/materials/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get file type icon name
     */
    getTypeIcon(type: MaterialType): string {
        const icons: Record<MaterialType, string> = {
            pdf: 'document-text',
            video: 'play-circle',
            doc: 'document',
            link: 'link',
            image: 'photograph',
            audio: 'music-note',
            slides: 'presentation-chart-bar',
        };
        return icons[type] || 'document';
    },

    /**
     * Format file size
     */
    formatFileSize(bytes?: number): string {
        if (!bytes) return 'Unknown size';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    },

    /**
     * Format duration (seconds to MM:SS or HH:MM:SS)
     */
    formatDuration(seconds?: number): string {
        if (!seconds) return '';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
};
