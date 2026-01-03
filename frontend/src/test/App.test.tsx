import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock API
vi.mock('../api', () => ({
    api: {
        getDashboard: vi.fn(),
    },
}))

describe('App Smoke Test', () => {
    it('renders register heading when not logged in', () => {
        localStorage.clear();
        render(<App />);
        expect(screen.getByText(/Join Poke-Work/i)).toBeInTheDocument();
    });

    it('clears session and redirects on auth error', async () => {
        const { api } = await import('../api');
        vi.mocked(api.getDashboard).mockRejectedValueOnce(new Error("AUTH_ERROR"));

        localStorage.setItem('authHeader', 'Basic stale');
        render(<App />);

        // Wait for effect to trigger event and App to re-render
        // Dashboard will throw the error, dispatch event, App will catch it
        await vi.waitFor(() => {
            expect(localStorage.getItem('authHeader')).toBeNull();
        }, { timeout: 1000 });
    });
});
