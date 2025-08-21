<<<<<<< HEAD
// Email validation function
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true; // Allow empty email (optional)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Get email validation error message
export const getEmailValidationError = (email: string): string | null => {
  if (!email || email.trim() === '') return null; // No error for empty email
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
=======
// Email validation function
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true; // Allow empty email (optional)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Get email validation error message
export const getEmailValidationError = (email: string): string | null => {
  if (!email || email.trim() === '') return null; // No error for empty email
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
>>>>>>> 0f2845e6b5b2b482e8c9f5bbce87ea359dbc2bbc
}; 