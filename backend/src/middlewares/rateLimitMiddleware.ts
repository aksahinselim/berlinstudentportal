import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for OTP verification attempts
 * Prevents brute force attacks on OTP codes
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 requests per 10 minutes per IP (lenient for demo)
  message: {
    success: false,
    error: 'Too many verification attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for OTP resend requests
 * Prevents spam of verification emails
 */
export const otpResendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 requests per 10 minutes per IP (lenient for demo)
  message: {
    success: false,
    error: 'Too many resend requests. Please wait before requesting another code.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for registration
 * Prevents mass account creation
 * Note: More lenient for development/demo purposes
 */
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 registrations per 15 minutes per IP (very lenient for demo)
  message: {
    success: false,
    error: 'Too many registration attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
  skipFailedRequests: false, // Count failed requests too
});

/**
 * Rate limiter for login
 * Prevents brute force password attacks
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
