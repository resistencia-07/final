// ============================================================
// NDURANCE — Auth Service
// TODO: Backend API — connect all methods to real endpoints
//
// There is no backend yet, so this mock layer persists whatever
// the person actually types at signup/login into localStorage —
// keyed by username — instead of always returning one hardcoded
// fake profile. This is what makes Login / Signup / Profile show
// real, entered data instead of a random mock user, and keeps
// showing the right person after a page refresh.
// ============================================================

import type { LoginFormData, SignupFormData, AuthResponse, AuthUser } from '../types/auth.types';

// TODO: Backend Integration Point — import apiInstance when ready
// import { apiInstance } from '../api/axiosInstance';

const USERS_KEY = 'ndurance_mock_users';
const CURRENT_USER_KEY = 'ndurance_current_user';

// Fallback defaults only used to fill in fields the person hasn't
// provided yet (e.g. logging in with a brand-new username that was
// never registered through the signup form).
const DEFAULTS = {
  age: 26,
  gender: 'male' as const,
  height: 175,
  weight: 70,
};

const titleCase = (raw: string): string =>
  raw
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const loadUsers = (): Record<string, AuthUser> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveUser = (user: AuthUser): void => {
  const users = loadUsers();
  users[user.username.toLowerCase()] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// ── Auth Service ─────────────────────────────────────────────

export const authService = {
  /**
   * Login with username and password.
   * TODO: Backend API — POST /auth/login
   */
  async login(data: LoginFormData): Promise<AuthResponse> {
    // TODO: Backend Integration Point
    // return apiInstance.request<AuthResponse>('POST', '/auth/login', data);

    await new Promise(r => setTimeout(r, 800)); // simulate network
    if (!data.username || !data.password) {
      throw new Error('Invalid credentials');
    }

    // Recall the real profile if this username signed up before,
    // otherwise derive a reasonable profile from the typed username
    // rather than always returning the same hardcoded person.
    const users = loadUsers();
    const existing = users[data.username.toLowerCase()];
    const user: AuthUser = existing ?? {
      id: data.username.toLowerCase(),
      username: data.username,
      fullName: titleCase(data.username),
      email: `${data.username.toLowerCase()}@ndurance.app`,
      age: DEFAULTS.age,
      gender: DEFAULTS.gender,
      height: DEFAULTS.height,
      weight: DEFAULTS.weight,
      createdAt: new Date().toISOString(),
    };

    saveUser(user);

    return {
      user,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  },

  /**
   * Register a new user.
   * TODO: Backend API — POST /auth/register
   */
  async register(data: SignupFormData): Promise<AuthResponse> {
    // TODO: Backend Integration Point
    // return apiInstance.request<AuthResponse>('POST', '/auth/register', data);

    await new Promise(r => setTimeout(r, 1000));

    const user: AuthUser = {
      id: data.username.toLowerCase(),
      username: data.username,
      fullName: data.fullName?.trim() || titleCase(data.username),
      email: data.email,
      age: data.age || DEFAULTS.age,
      gender: data.gender || DEFAULTS.gender,
      height: data.height || DEFAULTS.height,
      weight: data.weight || DEFAULTS.weight,
      createdAt: new Date().toISOString(),
    };

    saveUser(user);

    return {
      user,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  },

  /**
   * Logout current user.
   * TODO: Backend API — POST /auth/logout
   */
  async logout(): Promise<void> {
    // TODO: Backend Integration Point
    // await apiInstance.request('POST', '/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  /**
   * Refresh access token using refresh token.
   * TODO: Backend API — POST /auth/refresh
   */
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    // TODO: Backend Integration Point
    // return apiInstance.request('POST', '/auth/refresh', { refreshToken: token });
    void token;
    return { accessToken: 'mock-new-access-token' };
  },

  /**
   * Validate current session — restores the real signed-in profile
   * (not a random mock user) so a page refresh doesn't lose it.
   * TODO: Backend API — GET /auth/me
   */
  async getMe(): Promise<AuthUser> {
    // TODO: Backend Integration Point
    // return apiInstance.request<AuthUser>('GET', '/auth/me');
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        // fall through to error below
      }
    }
    throw new Error('No active session');
  },
};
