import { getAccessToken } from "@/stores/auth.helpers";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const rawUrl = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api/v1")
  .trim()
  .replace(/\/$/, "");
export const API_BASE_URL = rawUrl.endsWith("/api/v1") ? rawUrl : `${rawUrl}/api/v1`;

function readPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const REQUEST_TIMEOUT_MS = readPositiveNumber(process.env.EXPO_PUBLIC_API_TIMEOUT_MS, 30000);

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: unknown;
};

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const accessToken = getAccessToken();
    const hasBody = options.body !== undefined && options.body !== null;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers ?? {}),
      },
    });

    const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

    if (!body) {
      throw new ApiError("Không thể đọc phản hồi từ server", response.status, "INVALID_RESPONSE");
    }

    if (!response.ok || body.success === false) {
      if (body.success === false) {
        throw new ApiError(
          body.error.message,
          response.status,
          body.error.code,
          body.error.details,
        );
      }

      throw new ApiError("Request failed", response.status);
    }
    return body.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Kết nối quá lâu, vui lòng kiểm tra mạng", 408, "TIMEOUT");
    }

    throw new ApiError("Không thể kết nối đến server", undefined, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeoutId);
  }
}
