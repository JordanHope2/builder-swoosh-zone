import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pricing from './Pricing';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../contexts/AuthContext', async () => {
    const actual = await vi.importActual('../contexts/AuthContext');
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

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

const mockProducts = [
    {
        id: 'prod_1',
        name: 'Pro Plan',
        description: 'For professionals',
        metadata: { category: 'job_seekers', features: 'feature1,feature2', popular: 'true' },
        default_price: { id: 'price_1', unit_amount: 1000, recurring: { interval: 'month' } }
    },
    {
        id: 'prod_2',
        name: 'Enterprise Plan',
        description: 'For companies',
        metadata: { category: 'employers', features: 'feature3,feature4' },
        default_price: { id: 'price_2', unit_amount: 5000, recurring: { interval: 'month' } }
    },
];


describe('Pricing Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (global.fetch as jest.Mock).mockClear();
     queryClient.clear();
  });

  it('should display pricing plans when user is authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: { id: '123' }, session: { access_token: 'test_token' } });
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts),
    });
    renderWithProviders(<Pricing />);
    await waitFor(() => {
        expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    });
  });

  it('should show sign in message if not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, session: null });
    renderWithProviders(<Pricing />);
    expect(screen.getByText('Please sign in to view pricing')).toBeInTheDocument();
  });

  it('should call create-checkout-session mutation on subscribe click', async () => {
     mockUseAuth.mockReturnValue({ user: { id: '123' }, session: { access_token: 'test_token' } });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
    }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://stripe.com/checkout/test_session' }),
    });


    // Mock window.location.href
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { href: '' } as Location;


    renderWithProviders(<Pricing />);

    await waitFor(() => {
        expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    });

    const subscribeButton = screen.getByText('Subscribe Now');
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/billing/create-checkout-session', expect.any(Object));
    });

    await waitFor(() => {
        expect(window.location.href).toBe('https://stripe.com/checkout/test_session');
    });

    window.location = originalLocation;
  });
});
