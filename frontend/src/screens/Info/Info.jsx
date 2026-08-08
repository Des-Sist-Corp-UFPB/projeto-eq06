import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Info.css';

import { FiMessageSquare } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import ProductCarousel from '../../components/CarouselProduct/ProductCarousel';
import { AuthContext } from '../../context/AuthContext';

const Info = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleChatClick = () => {
    if (!user) {
      toast.info('Faça login para conversar com o vendedor');
      navigate('/login');
      return;
    }
    navigate(`/chat/${product.id}`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await fetch(`/api/produtos/${id}`);

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Falha ao carregar o produto. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const productImages = product?.imagem
    ? [product.imagem]
    : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      ];

  const formattedPrice = product?.preco
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(product.preco)
    : 'R$ 0,00';

  if (loading) {
    return (
      <div className="info-container">
        <Header />
        <main className="info-content">
          <div className="status-message">
            <p>Carregando produto...</p>
          </div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="info-container">
        <Header />
        <main className="info-content">
          <div className="status-message">
            <h2>Produto não encontrado</h2>
            <p>O produto com ID {id} não existe ou foi removido.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-container">
        <Header />
        <main className="info-content">
          <div className="status-message">
            <h2>Erro ao carregar produto</h2>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="info-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />

      <main className="info-content">
        <div className="property-grid">

          <div className="property-visual">
            <ProductCarousel product={{ images: productImages }} />

            <section className="description-area">
              <h2>{product.nome || `Produto ${id}`}</h2>
              <p>{product.descricao || 'Descrição não disponível.'}</p>
            </section>
          </div>

          <aside className="property-details">
            <div className="price-tag">
              <span className="symbol">R$</span>
              <span className="value">{formattedPrice.replace('R$ ', '')}</span>
            </div>
            <p className="category">Produto</p>

            <div className="contact-info">
              <p>E-mail: contato@empresa.com</p>
              <p>Telefone/WhatsApp: (83) 91234-5678</p>
            </div>

            <button className="btn-chat" onClick={handleChatClick}>
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
