/**
 * Password Validation Utility
 * 
 * Strong Password Rules:
 * - Length: 8-16 characters minimum
 * - Must contain at least one uppercase letter (A-Z)
 * - Must contain at least one lowercase letter (a-z)
 * - Must contain at least one number (0-9)
 * - Must contain at least one special character (!, @, #, $, %, etc.)
 * - No common patterns (qwerty, 12345, etc.)
 */

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number // 0-100
}

const commonPatterns = [
  'password', '12345', '123456', '1234567', '12345678', '123456789',
  'qwerty', 'abc123', 'password1', 'admin', 'letmein', 'welcome',
  'monkey', 'dragon', 'master', 'sunshine', 'princess', 'football'
]

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Check length (8-16 minimum)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else if (password.length >= 8) {
    score += 20
  }
  
  if (password.length >= 12) {
    score += 10
  }
  
  if (password.length >= 16) {
    score += 10
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)')
  } else {
    score += 20
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)')
  } else {
    score += 20
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)')
  } else {
    score += 15
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*, etc.)')
  } else {
    score += 15
  }

  // Check for common patterns
  const lowerPassword = password.toLowerCase()
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      errors.push('Password contains a common pattern. Please choose a more unique password')
      score = Math.max(0, score - 30)
      break
    }
  }

  // Check for repeated characters (aaa, 111, etc.)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password contains too many repeated characters')
    score = Math.max(0, score - 10)
  }

  // Check for sequential characters (abc, 123, etc.)
  if (hasSequentialChars(password)) {
    errors.push('Password contains sequential characters (abc, 123, etc.)')
    score = Math.max(0, score - 10)
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  if (score < 40) {
    strength = 'weak'
  } else if (score < 60) {
    strength = 'medium'
  } else if (score < 80) {
    strength = 'strong'
  } else {
    strength = 'very-strong'
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, score)
  }
}

function hasSequentialChars(password: string): boolean {
  const sequences = [
    'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
    '123', '234', '345', '456', '567', '678', '789', '890'
  ]
  
  const lowerPassword = password.toLowerCase()
  return sequences.some(seq => lowerPassword.includes(seq) || lowerPassword.includes(seq.split('').reverse().join('')))
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500'
    case 'medium':
      return 'text-yellow-500'
    case 'strong':
      return 'text-blue-500'
    case 'very-strong':
      return 'text-green-500'
    default:
      return 'text-zinc-500'
  }
}

export function getPasswordStrengthBg(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'strong':
      return 'bg-blue-500'
    case 'very-strong':
      return 'bg-green-500'
    default:
      return 'bg-zinc-300'
  }
}
