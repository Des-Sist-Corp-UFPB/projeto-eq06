import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Card from './Card';

describe('Card Component', () => {
    const mockProps = {
        id: 1,
        name: 'Produto Teste',
        price: 150.5,
        address: 'Rua Teste, 123',
        imgBaseUrl: 'http://teste.com/img.png',
        isAdmin: false,
        isFavorite: false,
        onToggleFavorite: vi.fn(),
        onDelete: vi.fn(),
    };

    const renderWithRouter = (component) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('renders the card with correct information', () => {
        renderWithRouter(<Card {...mockProps} />);

        expect(screen.getByText('Produto Teste')).toBeInTheDocument();
        expect(screen.getByText('Rua Teste, 123')).toBeInTheDocument();
        expect(screen.getByText('R$ 150,50')).toBeInTheDocument(); // Formatted price
        expect(screen.getByAltText('Foto do produto Produto Teste')).toHaveAttribute('src', 'http://teste.com/img.png');
    });

    it('does not render delete button if not admin', () => {
        renderWithRouter(<Card {...mockProps} isAdmin={false} />);
        expect(screen.queryByLabelText('Excluir produto')).not.toBeInTheDocument();
    });

    it('renders delete button and calls onDelete when clicked if admin', () => {
        renderWithRouter(<Card {...mockProps} isAdmin={true} />);
        const deleteButton = screen.getByLabelText('Excluir produto');
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        expect(mockProps.onDelete).toHaveBeenCalledWith(1);
    });

    it('calls onToggleFavorite when favorite button is clicked', () => {
        renderWithRouter(<Card {...mockProps} />);
        const favButton = screen.getByLabelText('Adicionar aos favoritos');
        
        fireEvent.click(favButton);
        expect(mockProps.onToggleFavorite).toHaveBeenCalledWith(1, true);
    });

    it('renders favorite icon correctly when isFavorite is true', () => {
        const { container } = renderWithRouter(<Card {...mockProps} isFavorite={true} />);
        const heartSvg = container.querySelector('.heart-img');
        expect(heartSvg).toBeInTheDocument();
        // Just triggering the branch is enough for coverage
    });

    it('does not throw error when onToggleFavorite is not provided and button is clicked', () => {
        const { onToggleFavorite, ...propsWithoutToggle } = mockProps;
        renderWithRouter(<Card {...propsWithoutToggle} />);
        const favButton = screen.getByLabelText('Adicionar aos favoritos');
        
        // This click should not throw an error, hitting the `onToggleFavorite &&` check
        expect(() => fireEvent.click(favButton)).not.toThrow();
    });
});
