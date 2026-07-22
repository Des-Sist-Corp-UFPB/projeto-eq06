import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoutesApp from './RoutesApp';

// Mock components to avoid deep rendering issues
vi.mock('../screens/Login/Login', () => ({ default: () => <div data-testid="login">Login Screen</div> }));
vi.mock('../screens/Main/Main', () => ({ default: () => <div data-testid="main">Main Screen</div> }));
vi.mock('../screens/Favorites/Favorites', () => ({ default: () => <div data-testid="favorites">Favorites Screen</div> }));
vi.mock('../screens/CriarConta/CriarConta', () => ({ default: () => <div data-testid="criar-conta">Criar Conta Screen</div> }));
vi.mock('../screens/Info/Info', () => ({ default: () => <div data-testid="info">Info Screen</div> }));
vi.mock('../screens/Checkout/Checkout', () => ({ default: () => <div data-testid="checkout">Checkout Screen</div> }));

describe('RoutesApp Component', () => {
    it('renders the AuthProvider and Routes, redirecting / to /login', () => {
        render(<RoutesApp />);
        expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    // Validating specific routes by overriding window.location is complex in jsdom with BrowserRouter
    // but the component rendering without error is a great baseline test.
});
