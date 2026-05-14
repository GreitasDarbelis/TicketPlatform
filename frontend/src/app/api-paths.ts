const API_BASE = "/api";

export const API_PATHS = {
    auth: {
        base: `${API_BASE}/auth`,
        login: `${API_BASE}/auth/login`,
        signup: `${API_BASE}/auth/signup`,
        me: `${API_BASE}/auth/me`,
        logout: `${API_BASE}/auth/logout`,
    },
    events: {
        base: `${API_BASE}/events`,
        byId: (eventId: string) => `${API_BASE}/events/${eventId}`,
    },
    tickets: {
        validate: (eventId: string) => `${API_BASE}/events/${eventId}/tickets/validate`,
    },
} as const;
