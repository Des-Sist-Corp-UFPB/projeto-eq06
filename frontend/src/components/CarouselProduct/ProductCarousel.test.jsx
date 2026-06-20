import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductCarousel from './ProductCarousel';

describe('ProductCarousel Component', () => {
    const mockProduct = {
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg']
    };

    it('returns null if no images are provided', () => {
        const { container } = render(<ProductCarousel product={{ images: [] }} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders first image by default', () => {
        render(<ProductCarousel product={mockProduct} />);
        const img = screen.getByAltText('Foto 1 do produto');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'img1.jpg');
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('swipes right to next image', () => {
        render(<ProductCarousel product={mockProduct} />);
        
        fireEvent.click(screen.getByLabelText('Próxima imagem'));
        
        const img = screen.getByAltText('Foto 2 do produto');
        expect(img).toHaveAttribute('src', 'img2.jpg');
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('swipes right from last to first image', () => {
        render(<ProductCarousel product={mockProduct} />);
        
        const nextBtn = screen.getByLabelText('Próxima imagem');
        fireEvent.click(nextBtn); // 2
        fireEvent.click(nextBtn); // 3
        fireEvent.click(nextBtn); // back to 1
        
        expect(screen.getByAltText('Foto 1 do produto')).toHaveAttribute('src', 'img1.jpg');
    });

    it('swipes left to previous image', () => {
        render(<ProductCarousel product={mockProduct} />);
        
        const nextBtn = screen.getByLabelText('Próxima imagem');
        const prevBtn = screen.getByLabelText('Imagem anterior');

        fireEvent.click(nextBtn); // 2
        fireEvent.click(prevBtn); // back to 1
        
        expect(screen.getByAltText('Foto 1 do produto')).toHaveAttribute('src', 'img1.jpg');
    });

    it('swipes left from first to last image', () => {
        render(<ProductCarousel product={mockProduct} />);
        
        fireEvent.click(screen.getByLabelText('Imagem anterior'));
        
        expect(screen.getByAltText('Foto 3 do produto')).toHaveAttribute('src', 'img3.jpg');
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });
});
