export const API_BASE = "http://localhost:8080/api";

type AuthResponse = string; // JWT token (mock for now)

export const api = {
    // Authentication
    async register(username: string, password: string): Promise<any> {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error("Registration failed");
        return res.json();
    },

    async login(username: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error("Login failed");
        return res.text(); // Returns raw string token
    },

    // Data Fetching
    async getDashboard() {
        const authHeader = localStorage.getItem('authHeader');
        if (!authHeader) throw new Error("No credentials found");

        const res = await fetch(`${API_BASE}/dashboard`, {
            headers: { 'Authorization': authHeader }
        });

        if (res.status === 401 || res.status === 403 || res.status === 404 || res.status === 500) {
            window.dispatchEvent(new Event('auth-expired'));
            throw new Error("AUTH_ERROR");
        }

        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
    },

    async logWork(hours: number) {
        const authHeader = localStorage.getItem('authHeader');
        if (!authHeader) throw new Error("No credentials found");

        const res = await fetch(`${API_BASE}/work`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({ hours })
        });
        if (!res.ok) throw new Error("Failed to log work");
        return res.json();
    },

    // Admin
    async getAdminUsers() {
        const authHeader = localStorage.getItem('authHeader');
        const res = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': authHeader || '' }
        });
        if (!res.ok) throw new Error("Failed to fetch admin users");
        return res.json();
    },

    async deleteUser(id: number) {
        const authHeader = localStorage.getItem('authHeader');
        const res = await fetch(`${API_BASE}/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': authHeader || '' }
        });
        if (!res.ok) throw new Error("Failed to delete user");
        return true;
    }
}
