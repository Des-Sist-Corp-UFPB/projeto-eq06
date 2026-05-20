import React from 'react';
import { useParams } from 'react-router-dom';
import './Info.css';

import { 
  // FiSearch, 
  // FiHeart, 
  // FiShoppingCart, 
  // FiUser, 
  // FiChevronLeft, 
  // FiChevronRight,
  FiMessageSquare 
} from 'react-icons/fi';

import LogoPBX from '../../assets/logo/1211 Sem Título_20260220094915.png';
import Header from '../../components/Header/Header';
import ProductCarousel from '../../components/CarouselProduct/ProductCarousel';

const Info = () => {
  const { id } = useParams();
  const imovel = {
    id: id,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"
    ]
  };
  return (
    <div className="info-container">
      <Header />
      {/* <header className="info-header">
        <div className="header-limit">
          <div className="logo-area">
            <img src={LogoPBX} alt="Logo PBX" />
          </div>

          <div className="search-box">
            <input type="text" placeholder="Buscar produtos, casas..." />
            <FiSearch className="search-btn-icon" />
          </div>

          <div className="nav-icons">
            <FiHeart className="nav-icon" />
            <FiShoppingCart className="nav-icon" />
            <div className="profile-avatar">
              <FiUser />
            </div>
          </div>
        </div>
      </header> */}

      <main className="info-content">
        <div className="property-grid">

          <div className="property-visual">
            <ProductCarousel product={imovel} />
            {/* <div className="main-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400" 
                alt="Apartamento" 
              />
              <button className="slide-arrow left"><FiChevronLeft /></button>
              <button className="slide-arrow right"><FiChevronRight /></button>
              <FiHeart className="floating-heart" />
            </div> */}

            <section className="description-area">
              <h2>Apartamento próximo ao centro {id}</h2>
              <p>
                Apartamento aconchegante próximo ao centro, com ambiente moderno, 
                bem iluminado e integrado entre sala e jantar. Oferece praticidade no 
                dia a dia e fácil acesso a comércios, serviços e transporte, sendo 
                ideal para morar ou investir.
              </p>
            </section>
          </div>

          <aside className="property-details">
            <div className="price-tag">
              <span className="symbol">R$</span>
              <span className="value">1999,00</span>
            </div>
            <p className="category">Aluguel</p>

            <div className="contact-info">
              <p>E-mail: samuel21@hotmail.com</p>
              <p>Telefone/WhatsApp: (83) 91546-2356</p>
            </div>

            <button className="btn-chat">
              <FiMessageSquare />
              Chat com o vendedor
            </button>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Info;