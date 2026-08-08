import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, AuthContext } from './AuthContext';
import { useContext } from 'react';

const TestComponent = () => {
    const { user, login, logout } = useContext(AuthContext);
    return (
        <div>
            <span data-testid="user-data">{user ? user.name : 'No user'}</span>
            <button onClick={() => login({ name: 'Test User' })}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('creates default user in localStorage if none exists', () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        const usersList = JSON.parse(localStorage.getItem('users_list'));
        expect(usersList).toHaveLength(1);
        expect(usersList[0].email).toBe('admin@gmail.com');
    });

    it('loads existing user from localStorage on mount', () => {
        localStorage.setItem('user_logged', JSON.stringify({ name: 'Saved User' }));
        render(<AuthProvider><TestComponent /></AuthProvider>);
        
        expect(screen.getByTestId('user-data')).toHaveTextContent('Saved User');
    });

    it('updates context and localStorage on login', () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        
        act(() => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('user-data')).toHaveTextContent('Test User');
        expect(localStorage.getItem('user_logged')).toContain('Test User');
    });

    it('clears context and localStorage on logout', () => {
        localStorage.setItem('user_logged', JSON.stringify({ name: 'Saved User' }));
        render(<AuthProvider><TestComponent /></AuthProvider>);
        
        act(() => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('user-data')).toHaveTextContent('No user');
        expect(localStorage.getItem('user_logged')).toBeNull();
    });
});
