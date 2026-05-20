import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./ProductCarousel.css";

function ProductCarousel({ product = { images: [] } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = product.images.length;

  const swipeLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const swipeRight = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  if (!totalImages) return null;

  return (
    <div className="container-carousel">
      <div className="container-icon-heart">
        <button className="btn-icon-heart" aria-label="Adicionar aos favoritos">
          <FiHeart className="img-icon" />
        </button>
      </div>

      <div className="container-arrow-buttons">
        <button onClick={swipeLeft} className="container-icon" aria-label="Imagem anterior">
          <FaArrowLeft className="img-icon" />
        </button>
        <button onClick={swipeRight} className="container-icon" aria-label="Próxima imagem">
          <FaArrowRight className="img-icon" />
        </button>
      </div>

      <div className="container-image-product">
        <img 
          className="image-product" 
          src={product.images[currentIndex]} 
          alt={`Foto ${currentIndex + 1} do produto`}
        />
        
        <div className="image-counter">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
    </div>
  );
}

export default ProductCarousel;
