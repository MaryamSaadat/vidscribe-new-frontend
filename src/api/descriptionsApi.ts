// api/descriptionsApi.ts
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { GET_VIDEO_DESCRIPTIONS, DESCRIPTIONS_EDIT_API} from '../utils/constants';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Description {
    id: number;
    text_history: string[];
    timestamp_end: number;
    timestamp_start: number;
    username_history: string[];
    video_id: number;
}

export interface GetDescriptionsResponse {
    descriptions: Description[];
}

export interface UpdateDescriptionPayload {
    id: number;
    modified_descriptions: string;
    time_stamp_start: number;
    time_stamp_end: number;
    username: string | undefined;
}

export interface CreateDescriptionPayload {
    video_id: string | number;
    text_history: string;
    time_stamp_start: number;
    time_stamp_end: number;
    username_history: string | undefined;
}

export interface ApiResponse {
    message: string;
}

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = GET_VIDEO_DESCRIPTIONS;

// Get JWT token from cookies
const getAuthToken = (): string | undefined => {
    return Cookies.get('jwt');
};

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch all descriptions for a specific video
 * @param videoId - The ID of the video
 * @returns Promise with descriptions array
 */
export const fetchVideoDescriptions = async (
    videoId: string | number
): Promise<Description[]> => {
    try {
        const response: AxiosResponse<GetDescriptionsResponse> = await axios.get(
            GET_VIDEO_DESCRIPTIONS,
            {
                params: { video_id: videoId },
            }
        );
        return response.data.descriptions;
    } catch (error) {
        console.error('Error fetching video descriptions:', error);
        throw new Error('Failed to load descriptions. Please try again.');
    }
};

/**
 * Create a new description for a video
 * @param payload - The description data to create
 * @returns Promise with API response
 */
export const createDescription = async (
    payload: Omit<CreateDescriptionPayload, 'jwt'>
): Promise<ApiResponse> => {
    try {
        const response: AxiosResponse<ApiResponse> = await apiClient.post(
            '//VidScribeDescriptions/',
            {
                ...payload,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating description:', error);
        throw new Error('Failed to add description. Please try again.');
    }
};

/**
 * Update an existing description
 * @param payload - The updated description data
 * @returns Promise with API response
 */
export const updateDescription = async (
    payload: Omit<UpdateDescriptionPayload, 'jwt'>
): Promise<ApiResponse> => {
    try {
        const token = getAuthToken();
        const response: AxiosResponse<ApiResponse> = await apiClient.put(
            '/descriptions/',
            {
                ...payload,
                jwt: token,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating description:', error);
        throw new Error('Failed to update description. Please try again.');
    }
};

/**
 * Delete a description by ID
 * @param descriptionId - The ID of the description to delete
 * @returns Promise with API response
 */
export const deleteDescription = async (
    descriptionId: number
): Promise<void> => {
    try {
        // Use the full AWS API Gateway URL for delete
        const deleteUrl = `${DESCRIPTIONS_EDIT_API}/${descriptionId}`;
        await axios.delete(deleteUrl);
    } catch (error) {
        console.error('Error deleting description:', error);
        throw new Error('Failed to delete description. Please try again.');
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format seconds to MM:SS
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert MM:SS to seconds
 * @param timeStr - Time string in MM:SS format
 * @returns Time in seconds
 */
export const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 0;
    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;
    return mins * 60 + secs;
};

/**
 * Validate timestamp inputs
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @returns Validation result with error message if invalid
 */
export const validateTimestamps = (
    startTime: string,
    endTime: string
): { isValid: boolean; error?: string } => {
    const startSeconds = parseInt(startTime);
    const endSeconds = parseInt(endTime);

    if (isNaN(startSeconds) || isNaN(endSeconds)) {
        return {
            isValid: false,
            error: 'Please enter valid timestamps.',
        };
    }

    if (endSeconds <= startSeconds) {
        return {
            isValid: false,
            error: 'End timestamp must be greater than start timestamp.',
        };
    }

    if (startSeconds < 0 || endSeconds < 0) {
        return {
            isValid: false,
            error: 'Timestamps cannot be negative.',
        };
    }

    return { isValid: true };
};

/**
 * Validate description text
 * @param description - Description text to validate
 * @returns Validation result with error message if invalid
 */
export const validateDescription = (
    description: string
): { isValid: boolean; error?: string } => {
    if (!description.trim()) {
        return {
            isValid: false,
            error: 'Description cannot be empty.',
        };
    }

    if (description.trim().length < 10) {
        return {
            isValid: false,
            error: 'Description must be at least 10 characters long.',
        };
    }

    return { isValid: true };
};