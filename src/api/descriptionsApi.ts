// api/descriptionsApi.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { GET_VIDEO_DESCRIPTIONS } from "../utils/constants";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Description {
  id: number;
  video_id: number;

  // backend fields
  text_history: string[];
  username_history: string[];

  timestamp_start: number;
  timestamp_end: number;
}

export interface GetDescriptionsResponse {
  descriptions: Description[];
}

export interface CreateDescriptionPayload {
  video_id: string | number;
  text: string;
  timestamp_start: number;
  timestamp_end: number;
  username?: string; // ✅ required by backend; we’ll fill if missing
}

export interface UpdateDescriptionPayload {
  id: number;
  text: string;
  username?: string; // ✅ likely required too
  timestamp_start?: number;
  timestamp_end?: number;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

// ============================================
// API CONFIGURATION
// ============================================

const deriveApiRoot = (full: string): string => {
  const cleaned = (full || "").replace(/\/+$/, "");
  const suffix = "/VidScribeDescriptions";
  return cleaned.endsWith(suffix) ? cleaned.slice(0, -suffix.length) : cleaned;
};

const API_ROOT = deriveApiRoot(GET_VIDEO_DESCRIPTIONS);
const DESCRIPTIONS_RESOURCE = "/VidScribeDescriptions";

const getAuthToken = (): string | undefined => Cookies.get("jwt");

// ✅ IMPORTANT: define how to get username in your app
// Replace this with whatever your app uses (cookie/localStorage/context).
const getUsername = (): string => {
  return (
    Cookies.get("username") ||
    localStorage.getItem("username") ||
    "anonymous"
  );
};

const apiClient = axios.create({
  baseURL: API_ROOT,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// ERROR HANDLING
// ============================================

function extractServerMessage(err: unknown): string {
  const e = err as AxiosError<any>;
  const data = e?.response?.data;

  if (Array.isArray(data) && data[0]?.msg) return String(data[0].msg); // pydantic list
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return String(data.message);
  if (data?.error) return String(data.error);

  if (data?.body) {
    try {
      const parsed = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
      if (Array.isArray(parsed) && parsed[0]?.msg) return String(parsed[0].msg);
      if (parsed?.message) return String(parsed.message);
      if (parsed?.error) return String(parsed.error);
      return JSON.stringify(parsed);
    } catch {
      return String(data.body);
    }
  }

  return (e?.message as string) || "Request failed. Please try again.";
}

function debugAxiosError(context: string, err: unknown) {
  const e = err as AxiosError<any>;
  console.error(`${context} (DETAILS)`, {
    status: e?.response?.status,
    responseData: e?.response?.data,
    url: e?.config?.url,
    method: e?.config?.method,
    sent: e?.config?.data,
    params: e?.config?.params,
  });
}

// ============================================
// API FUNCTIONS
// ============================================

export const fetchVideoDescriptions = async (videoId: string | number): Promise<Description[]> => {
  try {
    const response: AxiosResponse<GetDescriptionsResponse> = await apiClient.get(
      `${DESCRIPTIONS_RESOURCE}`,
      { params: { video_id: String(videoId) } }
    );

    return Array.isArray(response.data?.descriptions) ? response.data.descriptions : [];
  } catch (error) {
    debugAxiosError("Error fetching video descriptions", error);
    throw new Error(extractServerMessage(error));
  }
};

export const createDescription = async (payload: CreateDescriptionPayload): Promise<ApiResponse> => {
  try {
    const token = getAuthToken();
    const username = payload.username || getUsername(); // ✅ required by backend

    const clean = {
      video_id: Number(payload.video_id),
      text: String(payload.text ?? ""),
      timestamp_start: Number(payload.timestamp_start),
      timestamp_end: Number(payload.timestamp_end),
      username, // ✅ add it
      ...(token ? { jwt: token } : {}), // keep if backend checks jwt in body
    };

    const res: AxiosResponse<ApiResponse> = await apiClient.post(
      `${DESCRIPTIONS_RESOURCE}`,
      clean
    );

    return res.data;
  } catch (error) {
    debugAxiosError("Error creating description", error);
    throw new Error(extractServerMessage(error));
  }
};

export const updateDescription = async (payload: UpdateDescriptionPayload): Promise<ApiResponse> => {
  const token = getAuthToken();
  const username = payload.username || getUsername(); // ✅ likely required

  const clean: any = {
    id: Number(payload.id),
    text: String(payload.text ?? ""),
    username, // ✅ add it
    ...(token ? { jwt: token } : {}),
  };

  if (payload.timestamp_start !== undefined) clean.timestamp_start = Number(payload.timestamp_start);
  if (payload.timestamp_end !== undefined) clean.timestamp_end = Number(payload.timestamp_end);

  try {
    // Try PUT /resource with id in body (common in lambda proxy)
    const res: AxiosResponse<ApiResponse> = await apiClient.put(`${DESCRIPTIONS_RESOURCE}`, clean);
    return res.data;
  } catch (error1) {
    debugAxiosError("Update attempt 1 failed (PUT /resource)", error1);

    try {
      // Fallback PUT /resource/{id}
      const res2: AxiosResponse<ApiResponse> = await apiClient.put(
        `${DESCRIPTIONS_RESOURCE}/${clean.id}`,
        clean
      );
      return res2.data;
    } catch (error2) {
      debugAxiosError("Update attempt 2 failed (PUT /resource/{id})", error2);
      throw new Error(extractServerMessage(error2));
    }
  }
};

export const deleteDescription = async (descriptionId: number): Promise<void> => {
  const token = getAuthToken();
  const username = getUsername(); // ✅ if backend requires username for auditing
  const id = Number(descriptionId);

  try {
    // Attempt 1: DELETE /resource?id=123 (common)
    await apiClient.delete(`${DESCRIPTIONS_RESOURCE}`, {
      params: { id },
      ...(token ? { data: { jwt: token, username } } : { data: { username } }),
    });
  } catch (error1) {
    debugAxiosError("Delete attempt 1 failed (DELETE /resource?id=)", error1);

    try {
      // Fallback DELETE /resource/123
      await apiClient.delete(`${DESCRIPTIONS_RESOURCE}/${id}`, {
        ...(token ? { data: { jwt: token, username } } : { data: { username } }),
      });
    } catch (error2) {
      debugAxiosError("Delete attempt 2 failed (DELETE /resource/{id})", error2);
      throw new Error(extractServerMessage(error2));
    }
  }
};

// ============================================
// UTILITIES
// ============================================

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(":");
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
};

export const validateTimestamps = (
  startTime: string,
  endTime: string
): { isValid: boolean; error?: string } => {
  const startSeconds = parseInt(startTime, 10);
  const endSeconds = parseInt(endTime, 10);

  if (isNaN(startSeconds) || isNaN(endSeconds)) {
    return { isValid: false, error: "Please enter valid timestamps." };
  }
  if (endSeconds <= startSeconds) {
    return { isValid: false, error: "End timestamp must be greater than start timestamp." };
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
    return { isValid: false, error: "Description must be at least 10 characters long." };
  }
  return { isValid: true };
};