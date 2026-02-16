/**
 * Extract error message from various error response formats
 */
export const extractErrorMessage = (error: any): string => {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Check for response object attached to error (from apiRequest)
  // Priority: error.response > error (direct)
  const responseData = error?.response || error;

  // PRIORITY 1: Check for validation errors array (backend format) - most specific
  if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    // Find subscription-related error first (most important)
    const subscriptionError = responseData.errors.find((e: any) => 
      e.field === 'subscription' || 
      e.message?.toLowerCase().includes('limit') || 
      e.message?.toLowerCase().includes('upgrade') ||
      e.message?.toLowerCase().includes('pro/couple/lifetime') ||
      e.message?.toLowerCase().includes('reached your limit')
    );
    
    if (subscriptionError && subscriptionError.message) {
      return subscriptionError.message;
    }
    
    // Return first error message from errors array (more specific than top-level message)
    const firstError = responseData.errors[0];
    if (firstError?.message) {
      return firstError.message;
    }
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  // PRIORITY 2: Check for nested error objects
  if (responseData?.error?.message) {
    return responseData.error.message;
  }

  if (responseData?.error) {
    return typeof responseData.error === 'string' ? responseData.error : responseData.error.message || 'An error occurred';
  }

  // PRIORITY 3: Check error.message directly (before top-level message)
  if (error?.message && error.message !== 'Validation error') {
    return error.message;
  }

  // PRIORITY 4: Check for top-level message property (least specific)
  if (responseData?.message && responseData.message !== 'Validation error') {
    return responseData.message;
  }

  // If we have a generic "Validation error" but no detailed errors, try to get more info
  if (responseData?.message === 'Validation error' && responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    const firstError = responseData.errors[0];
    if (firstError?.message) {
      return firstError.message;
    }
  }

  // Default fallback
  return 'An error occurred. Please try again.';
};

/**
 * Check if error is a subscription limit error
 */
export const isSubscriptionLimitError = (error: any): boolean => {
  // Check response data first
  const responseData = error?.response || error;
  
  // Check if errors array contains subscription field
  if (responseData?.errors && Array.isArray(responseData.errors)) {
    const hasSubscriptionError = responseData.errors.some((e: any) => 
      e.field === 'subscription' ||
      e.message?.toLowerCase().includes('limit') ||
      e.message?.toLowerCase().includes('upgrade')
    );
    if (hasSubscriptionError) return true;
  }
  
  // Check message content
  const message = extractErrorMessage(error).toLowerCase();
  return message.includes('limit') || 
         message.includes('upgrade') || 
         message.includes('reached your limit') ||
         message.includes('pro/couple/lifetime') ||
         message.includes('unlimited access');
};
