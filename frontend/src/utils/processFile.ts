import { redirect } from 'next/navigation';

/**
 * Xử lý lỗi và chuyển hướng đến trang error nếu cần thiết
 * @param error Lỗi cần xử lý
 * @param redirectToError Có chuyển hướng đến trang error không
 */
export const handleError = (error: unknown, redirectToError = true): Error => {
  console.error('Error occurred:', error);
  
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
  
  // Nếu cần chuyển hướng, chuyển đến trang error với thông tin lỗi
  if (redirectToError) {
    const errorMessage = encodeURIComponent(normalizedError.message);
    redirect(`/error?message=${errorMessage}`);
  }
  
  return normalizedError;
};

/**
 * Kiểm tra response HTTP và xử lý lỗi nếu status không phải 2xx
 * @param response Response từ fetch API
 */
export const checkResponseStatus = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    // Nếu lỗi 404, chuyển đến trang error
    if (response.status === 404) {
      redirect('/error?code=404');
    }
    
    // Đọc thông báo lỗi từ response nếu có
    const errorText = await response.text();
    let errorMessage;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || `Error ${response.status}`;
    } catch {
      errorMessage = `Error ${response.status}: ${errorText || response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
};

/**
 * Xử lý file upload và các lỗi liên quan
 * @param file File cần xử lý
 * @param allowedTypes Mảng các loại file được cho phép
 * @param maxSizeMB Kích thước tối đa tính bằng MB
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[] = [], 
  maxSizeMB = 5
): { valid: boolean; error?: string } => {
  // Kiểm tra loại file nếu có chỉ định
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Kiểm tra kích thước file
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  
  return { valid: true };
};
