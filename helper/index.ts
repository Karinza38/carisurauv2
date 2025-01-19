type ApiResponse<T> = {
    data: T | null;
    error: string | null;
  };
  
  export function createApiResponse<T>(
    data: T | null,
    error: string | null,
  ): ApiResponse<T> {
    return { data, error };
  }
  
  export async function handleApiRequest<T>(
    requestFn: () => Promise<T>,
  ): Promise<ApiResponse<T>> {
    try {
      const data = await requestFn();
      return createApiResponse<T>(data, null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return createApiResponse<T>(null, errorMessage);
    }
  }
  