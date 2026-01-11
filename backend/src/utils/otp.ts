import crypto from 'crypto';

/**
 * Generate a 6-digit OTP code
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP code with SHA-256 and secret salt
 * @param code - The OTP code to hash
 * @returns Hashed OTP
 */
export function hashOtp(code: string): string {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return crypto
    .createHmac('sha256', secret)
    .update(code)
    .digest('hex');
}

/**
 * Verify OTP code against hash
 * @param code - The OTP code to verify
 * @param hash - The stored hash
 * @returns True if code matches hash
 */
export function verifyOtp(code: string, hash: string): boolean {
  const codeHash = hashOtp(code);
  return crypto.timingSafeEqual(
    Buffer.from(codeHash),
    Buffer.from(hash)
  );
}

/**
 * Calculate OTP expiry time
 * @param minutes - Minutes until expiry (default from env)
 * @returns Date object for expiry
 */
export function getOtpExpiry(minutes?: number): Date {
  const ttl = minutes || parseInt(process.env.OTP_TTL_MINUTES || '10');
  return new Date(Date.now() + ttl * 60 * 1000);
}

/**
 * Check if OTP has expired
 * @param expiresAt - The expiry date
 * @returns True if expired
 */
export function isOtpExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
