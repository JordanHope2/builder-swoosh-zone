import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OwnerAdminDashboard from './OwnerAdminDashboard';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('../contexts/AuthContext', async () => {
    const actual = await vi.importActual('../contexts/AuthContext');
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

vi.mock('@/components/ui/improved-navigation', () => ({
  default: () => <nav data-testid="mock-navigation">Mock Navigation</nav>,
}));
vi.mock('@/components/ui/sidebar', () => ({
  default: () => <aside data-testid="mock-sidebar">Mock Sidebar</aside>,
}));
vi.mock('@/components/ui/page-header', () => ({
    default: () => <header data-testid="mock-header">Mock Header</header>,
}));

global.fetch = vi.fn();

const mockUseAuth = useAuth as jest.Mock;
const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
                <BrowserRouter>
                    {ui}
                </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
      </QueryClientProvider>
    );
  };

describe('OwnerAdminDashboard Page', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (global.fetch as jest.Mock).mockClear();
        queryClient.clear();
        mockUseAuth.mockReturnValue({ session: { access_token: 'test_token' } });

        // Default mocks for all data fetches
        const mockUsers = { users: [{ id: 1, full_name: 'Test User', email: 'user@example.com', role: 'user' }]};
        const mockJobs = { jobs: [] };
        const mockSubscriptions = { subscriptions: [] };

        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url.toString().includes('/api/admin/users')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUsers.users) });
            }
            if (url.toString().includes('/api/admin/jobs')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockJobs.jobs) });
            }
            if (url.toString().includes('/api/admin/subscriptions')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSubscriptions.subscriptions) });
            }
            if (url.toString().startsWith('/api/admin/users/')) { // For DELETE
                return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
            }
            return Promise.reject(new Error(`Unhandled fetch: ${url}`));
        });
    });

  it('should display a list of users in the User Management tab', async () => {
    renderWithProviders(<OwnerAdminDashboard />);

    // Click the tab
    fireEvent.click(screen.getByText('User Management'));

    // Check for user data
    await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('should call the delete mutation when delete button is clicked', async () => {
    const mockUsers = { users: [{ id: 1, full_name: 'Test User', email: 'user@example.com', role: 'user' }]};
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.toString().includes('/api/admin/users')) {
            return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUsers.users) });
        }
        if (url.toString().startsWith('/api/admin/users/')) { // For DELETE
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });

    renderWithProviders(<OwnerAdminDashboard />);

    fireEvent.click(screen.getByText('User Management'));

    await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

    // Mock window.confirm
    window.confirm = vi.fn(() => true);

    const deleteButton = screen.getByTestId('delete-user-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/1', expect.objectContaining({
            method: 'DELETE'
        }));
    });
  });
});
