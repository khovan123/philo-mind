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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

const REQUEST_TIMEOUT_MS = 10000;

type ApiSuccessResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  details?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    let body: ApiSuccessResponse<T> | ApiErrorResponse | null = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      const errorBody = body as ApiErrorResponse | null;

      throw new ApiError(
        errorBody?.message ?? "Request failed",
        response.status,
        errorBody?.code,
        errorBody?.details,
      );
    }

    if (body && typeof body === "object" && "data" in body) {
      return (body as ApiSuccessResponse<T>).data as T;
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Kết nối quá lâu, vui lòng kiểm tra mạng");
    }

    throw new ApiError("Không thể kết nối đến server");
  } finally {
    clearTimeout(timeoutId);
  }
}
