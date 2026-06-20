import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./routes/RoutesApp', () => ({
    default: () => <div data-testid="mock-routes">Mock Routes</div>
}));

describe('App Component', () => {
    it('renders RoutesApp', () => {
        render(<App />);
        expect(screen.getByTestId('mock-routes')).toBeInTheDocument();
    });
});
