// api/descriptionsApi.ts
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { GET_VIDEO_DESCRIPTIONS } from "../utils/constants";

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
  text_history: string; // your current type says string; backend might want string or array depending on model
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

// You currently use GET_VIDEO_DESCRIPTIONS as a full URL.
// In your logs, it appears to be something like:
// https://.../default/VidScribeDescriptions
//
// For PUT/POST/DELETE we need the API ROOT (https://.../default) and then add /VidScribeDescriptions ourselves.
//
// This helper derives API_ROOT safely if GET_VIDEO_DESCRIPTIONS ends with /VidScribeDescriptions
const deriveApiRoot = (full: string): string => {
  // Remove trailing slashes
  const cleaned = (full || "").replace(/\/+$/, "");
  // Remove the resource suffix if present
  const suffix = "/VidScribeDescriptions";
  if (cleaned.endsWith(suffix)) {
    return cleaned.slice(0, -suffix.length);
  }
  // If constants already point to root, keep it
  return cleaned;
};

const API_ROOT = deriveApiRoot(GET_VIDEO_DESCRIPTIONS);
const DESCRIPTIONS_RESOURCE = "/VidScribeDescriptions";

// Get JWT token from cookies
const getAuthToken = (): string | undefined => Cookies.get("jwt");

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch all descriptions for a specific video
 */
export const fetchVideoDescriptions = async (
  videoId: string | number
): Promise<Description[]> => {
  try {
    // This endpoint appears correct for your backend:
    // GET /VidScribeDescriptions?video_id=...
    const response: AxiosResponse<GetDescriptionsResponse> = await axios.get(
      `${API_ROOT}${DESCRIPTIONS_RESOURCE}`,
      { params: { video_id: videoId } }
    );
    return response.data.descriptions;
  } catch (error) {
    console.error("Error fetching video descriptions:", error);
    throw new Error("Failed to load descriptions. Please try again.");
  }
};

/**
 * Create a new description for a video
 */
export const createDescription = async (
  payload: Omit<CreateDescriptionPayload, "jwt">
): Promise<ApiResponse> => {
  try {
    const token = getAuthToken();

    // IMPORTANT:
    // Your backend POST uses DescriptionCreate(**body).
    // If your Pydantic model expects:
    // - text_history (string or list), keep as below
    // - OR text, change text_history -> text
    const body = {
      video_id: payload.video_id,
      text_history: payload.text_history, // <-- change to `text` if backend expects text, not text_history
      timestamp_start: payload.time_stamp_start,
      timestamp_end: payload.time_stamp_end,
      jwt: token,
    };

    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `${DESCRIPTIONS_RESOURCE}`,
      body
    );

    return response.data;
  } catch (error) {
    console.error("Error creating description:", error);
    throw new Error("Failed to add description. Please try again.");
  }
};

/**
 * Update an existing description (EDIT)
 *
 * Backend expects:
 * PUT /VidScribeDescriptions/{id}
 * Body must include field: text
 */
export const updateDescription = async (
  payload: Omit<UpdateDescriptionPayload, "jwt">
): Promise<ApiResponse> => {
  try {
    const token = getAuthToken();

    // This is the key fix:
    // - correct URL includes ID
    // - correct body field is `text` (backend checks description_fields.text)
    const body = {
      text: payload.modified_descriptions,
      jwt: token,
    };

    const response: AxiosResponse<ApiResponse> = await apiClient.put(
      `${DESCRIPTIONS_RESOURCE}/${payload.id}`,
      body
    );

    return response.data;
  } catch (error) {
    console.error("Error updating description:", error);
    throw new Error("Failed to update description. Please try again.");
  }
};

/**
 * Delete a description by ID
 */
export const deleteDescription = async (descriptionId: number): Promise<void> => {
  try {
    const token = getAuthToken();

    await apiClient.delete(`${DESCRIPTIONS_RESOURCE}/${descriptionId}`, {
      // Only include body if your backend verify_user expects it.
      // If delete is public, you can remove `data`.
      data: { jwt: token },
    });
  } catch (error) {
    console.error("Error deleting description:", error);
    throw new Error("Failed to delete description. Please try again.");
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(":");
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0]) || 0;
  const secs = parseInt(parts[1]) || 0;
  return mins * 60 + secs;
};

export const validateTimestamps = (
  startTime: string,
  endTime: string
): { isValid: boolean; error?: string } => {
  const startSeconds = parseInt(startTime);
  const endSeconds = parseInt(endTime);

  if (isNaN(startSeconds) || isNaN(endSeconds)) {
    return { isValid: false, error: "Please enter valid timestamps." };
  }
  if (endSeconds <= startSeconds) {
    return {
      isValid: false,
      error: "End timestamp must be greater than start timestamp.",
    };
  }
  if (startSeconds < 0 || endSeconds < 0) {
    return { isValid: false, error: "Timestamps cannot be negative." };
  }

  return { isValid: true };
};

export const validateDescription = (
  description: string
): { isValid: boolean; error?: string } => {
  if (!description.trim()) {
    return { isValid: false, error: "Description cannot be empty." };
  }
  if (description.trim().length < 10) {
    return {
      isValid: false,
      error: "Description must be at least 10 characters long.",
    };
  }
  return { isValid: true };
};
