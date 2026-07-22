import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Header Component', () => {
    const renderWithContext = (user, logoutFn = vi.fn()) => {
        return render(
            <AuthContext.Provider value={{ user, logout: logoutFn }}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders auth buttons when no user is logged in', () => {
        renderWithContext(null);
        
        expect(screen.getByText('Entrar')).toBeInTheDocument();
        expect(screen.getByText('Criar conta')).toBeInTheDocument();
    });

    it('renders user info and logout when user is logged in', () => {
        const mockUser = { name: 'João Teste' };
        renderWithContext(mockUser);
        
        expect(screen.getByText('Olá, João Teste')).toBeInTheDocument();
        expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
    });

    it('calls logout and navigate to /login when logout icon is clicked', () => {
        const mockLogout = vi.fn();
        const mockUser = { name: 'João Teste' };
        renderWithContext(mockUser, mockLogout);
        
        const logoutIcon = screen.getByTitle('Sair');
        fireEvent.click(logoutIcon);
        
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
