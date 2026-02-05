import api from '../lib/api';
import { API_BASE_URL, ENDPOINTS } from './config';
import axios from 'axios';

/**
 * Get a presigned URL for direct S3 upload
 * @param {string} fileName - Name of the file
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Target folder path (e.g. 'style-guides/logos' or 'vaults/documents')
 * @returns {Promise<{uploadUrl: string, fileKey: string, expiresAt: string}>}
 */
export const getPresignedUrl = async (fileName, fileType, folder) => {
    const response = await api.post(ENDPOINTS.UPLOADS.PRESIGN, {
        fileName,
        fileType,
        folder,
    }, {
        baseURL: API_BASE_URL,
    });
    return response.data.data;
};

/**
 * Upload a file directly to S3 using a presigned URL
 * @param {string} uploadUrl - The presigned upload URL
 * @param {File} file - The file object to upload
 * @returns {Promise<void>}
 */
export const uploadToS3 = async (uploadUrl, file) => {
    // We use a clean axios instance for S3 upload to avoid sending our API auth headers to S3
    // which would cause a SignatureDoesNotMatch error or 400 Bad Request
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};
