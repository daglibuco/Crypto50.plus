
// Types for CRM Data
export interface UserRegistration {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  timestamp: string;
}

// Mock Database Keys for LocalStorage
const DB_KEY = 'crypto50_crm_leads';
const CREDITS_KEY = 'crypto50_user_credits';

// VIP Demo User Data
const VIP_USER: UserRegistration = {
    firstName: 'Daniel',
    lastName: 'Grossmann',
    dob: '1975-05-20',
    email: 'daniel-grossmann@hotmail.com',
    timestamp: new Date().toISOString()
};

// Investor Demo User Data
const INVESTOR_USER: UserRegistration = {
    firstName: 'Investor',
    lastName: 'Guest',
    dob: '1980-01-01',
    email: 'test@crypto50.plus',
    timestamp: new Date().toISOString()
};

/**
 * Treasury Management: Credits Logic
 */
export const getUserCredits = (): number => {
  const saved = localStorage.getItem(CREDITS_KEY);
  if (saved === null) {
    localStorage.setItem(CREDITS_KEY, "50");
    return 50;
  }
  return parseInt(saved);
};

export const deductCredits = (amount: number = 1): boolean => {
  const current = getUserCredits();
  if (current < amount) return false;
  
  const newValue = current - amount;
  localStorage.setItem(CREDITS_KEY, newValue.toString());
  
  // Dispatch a custom event so the UI updates globally
  window.dispatchEvent(new Event('credits_updated'));
  return true;
};

/**
 * Saves a new user registration to the "Temporary Backend" (LocalStorage)
 */
export const saveRegistration = (data: Omit<UserRegistration, 'timestamp'>): boolean => {
  try {
    const payload: UserRegistration = {
      ...data,
      timestamp: new Date().toISOString()
    };

    const existingRaw = localStorage.getItem(DB_KEY);
    const existingUsers: UserRegistration[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    if (!existingUsers.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        existingUsers.push(payload);
        localStorage.setItem(DB_KEY, JSON.stringify(existingUsers));
        // Initialize credits for new user
        localStorage.setItem(CREDITS_KEY, "50");
    }

    return true;
  } catch (error) {
    console.error("CRM Save Error:", error);
    return false;
  }
};

/**
 * Validates if a user exists by email (Mock Login)
 */
export const validateMemberLogin = (email: string): UserRegistration | null => {
    const loginEmail = email.toLowerCase();
    
    if (loginEmail === VIP_USER.email.toLowerCase()) return VIP_USER;
    if (loginEmail === INVESTOR_USER.email.toLowerCase()) return INVESTOR_USER;

    const existingRaw = localStorage.getItem(DB_KEY);
    if (!existingRaw) return null;
    
    const users: UserRegistration[] = JSON.parse(existingRaw);
    return users.find(u => u.email.toLowerCase() === loginEmail) || null;
};

/**
 * Retrieves all registered users
 */
export const getAllRegistrations = (): UserRegistration[] => {
    const existingRaw = localStorage.getItem(DB_KEY);
    let users: UserRegistration[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    if (!users.some(u => u.email.toLowerCase() === VIP_USER.email.toLowerCase())) {
        users = [VIP_USER, ...users];
    }
    if (!users.some(u => u.email.toLowerCase() === INVESTOR_USER.email.toLowerCase())) {
        users = [INVESTOR_USER, ...users];
    }
    
    return users;
};
