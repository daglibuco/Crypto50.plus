
// Types for CRM Data
export interface UserRegistration {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  timestamp: string;
  membershipStatus?: 'free' | 'premium';
  credits?: number;
}

// Mock Database Keys for LocalStorage
const DB_KEY = 'crypto50_crm_leads';
const CREDITS_KEY = 'crypto50_user_credits';
const SESSION_KEY = 'crypto50_active_session';

// VIP Demo User Data
const VIP_USER: UserRegistration = {
    firstName: 'Daniel',
    lastName: 'Grossmann',
    dob: '1975-05-20',
    email: 'daniel-grossmann@hotmail.com',
    timestamp: new Date().toISOString(),
    membershipStatus: 'premium',
    credits: 999
};

/**
 * Treasury Management: Credits Logic
 */
export const getUserCredits = (): number => {
  const session = getActiveSession();
  if (session && session.credits !== undefined) return session.credits;
  
  const saved = localStorage.getItem(CREDITS_KEY);
  if (saved === null) {
    localStorage.setItem(CREDITS_KEY, "50");
    return 50;
  }
  return parseInt(saved);
};

export const addCredits = (amount: number): void => {
  const session = getActiveSession();
  if (session) {
    session.credits = (session.credits || 0) + amount;
    saveSession(session);
    
    // Update master DB as well
    const users = getAllRegistrations();
    const idx = users.findIndex(u => u.email === session.email);
    if (idx !== -1) {
      users[idx].credits = session.credits;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
  } else {
    const current = getUserCredits();
    localStorage.setItem(CREDITS_KEY, (current + amount).toString());
  }
  window.dispatchEvent(new Event('credits_updated'));
};

export const deductCredits = (amount: number = 1): boolean => {
  const current = getUserCredits();
  if (current < amount) return false;
  
  const newValue = current - amount;
  const session = getActiveSession();
  if (session) {
    session.credits = newValue;
    saveSession(session);
    
    const users = getAllRegistrations();
    const idx = users.findIndex(u => u.email === session.email);
    if (idx !== -1) {
      users[idx].credits = newValue;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
  } else {
    localStorage.setItem(CREDITS_KEY, newValue.toString());
  }
  
  window.dispatchEvent(new Event('credits_updated'));
  return true;
};

/**
 * Session Management
 */
export const saveSession = (user: UserRegistration) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getActiveSession = (): UserRegistration | null => {
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Saves a new user registration to the "Temporary Backend" (LocalStorage)
 */
export const saveRegistration = (data: Omit<UserRegistration, 'timestamp'>): boolean => {
  try {
    const payload: UserRegistration = {
      ...data,
      timestamp: new Date().toISOString(),
      membershipStatus: 'free',
      credits: 50
    };

    const existingRaw = localStorage.getItem(DB_KEY);
    const existingUsers: UserRegistration[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    if (!existingUsers.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        existingUsers.push(payload);
        localStorage.setItem(DB_KEY, JSON.stringify(existingUsers));
    }

    saveSession(payload);
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
    
    if (loginEmail === VIP_USER.email.toLowerCase()) {
      saveSession(VIP_USER);
      return VIP_USER;
    }

    const existingRaw = localStorage.getItem(DB_KEY);
    if (!existingRaw) return null;
    
    const users: UserRegistration[] = JSON.parse(existingRaw);
    const user = users.find(u => u.email.toLowerCase() === loginEmail) || null;
    if (user) saveSession(user);
    return user;
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
    
    return users;
};
