import React, { useState, useEffect, useContext } from "react";
import "./Main.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import ProdutoModal from "../../components/ProdutoModal/ProdutoModal";
import { AuthContext } from "../../context/AuthContext";

const bannerImages = [
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
];

// Dados iniciais (podem ser usados enquanto a API não responde ou como placeholder)
// const productsData = ...

const Main = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.email === 'admin';

    const [currentBanner, setCurrentBanner] = useState(0);
    const [productsData, setProductsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }

        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProductsData(prev => prev.filter(p => p.id !== id));
                toast.success("Produto excluído com sucesso!");
            } else {
                toast.error("Falha ao excluir o produto.");
            }
        } catch (err) {
            console.error("Erro ao excluir:", err);
            toast.error("Falha ao comunicar com o servidor.");
        }
    };

    const handleProductCreated = (newProduct) => {
        // Adiciona o produto mais recente no início da lista
        setProductsData(prev => [newProduct, ...prev]);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        // Fetch products from API
        fetch('/api/produtos')
            .then(res => res.json())
            .then(data => {
                // Se a API retornar paginação, os dados estarão em data.content
                if (data.content) {
                    setProductsData(data.content);
                } else if (Array.isArray(data)) {
                    setProductsData(data);
                }
            })
            .catch(err => console.error("Erro ao buscar produtos:", err));

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pbx-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Header />
            <section
                className="hero"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bannerImages[currentBanner]})` }}
            >
                <div className="hero-content">
                    <h1><span>Compre,</span> <span>venda,</span> <span>alugue</span></h1>
                    <p>Quer crescer seu negócio?</p>
                    <div className="brand-help">
                        <img className="pbx-logo-carrossel" src={pbxLogo} alt="" />
                        <span> te ajuda!!!</span>
                    </div> 
                </div>
                <div className="carousel-dots">
                    {bannerImages.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentBanner ? "active" : ""}`}
                            onClick={() => setCurrentBanner(index)}
                        ></span>
                    ))}
                </div>
            </section>

            <main className="product-section">
                <div style={{ margin: '0 40px 20px 40px' }}>
                    <h2 style={{ color: 'var(--dark-blue)', margin: 0 }}>Catálogo de Produtos</h2>
                </div>
                
                <div className="product-grid">
                    {productsData.map((product) => (
                        <Card 
                            key={product.id} 
                            id={product.id} 
                            imgBaseUrl={product.imagem || pbxLogo} 
                            name={product.title || product.nome} 
                            price={product.price || product.preco} 
                            address={product.local || 'Local - PB'}
                            isAdmin={isAdmin}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            </main>

            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Sobre a Empresa</h4>
                        <p>Nossa missão é oferecer produtos de qualidade com preços justos, sempre garantindo uma experiência de compra simples e segura.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Políticas da Empresa</h4>
                        <ul>
                            <li><a href="#!">Política de Privacidade</a></li>
                            <li><a href="#!">Termos de Uso</a></li>
                            <li><a href="#!">Trocas e Devoluções</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Dúvidas Frequentes</h4>
                        <p>Precisa de ajuda? Confira nossas perguntas frequentes sobre pagamentos, envio e devoluções.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Contatos</h4>
                        <p>E-mail: pbx@gmail.com.br</p>
                        <p>WhatsApp: (83) 91234-5678</p>
                        <p>Seg-Sex, 9h-18h</p>
                    </div>
                </div>
                <div className="footer-social-large">
                    <FaFacebookF /><FaInstagram /><FaTwitter /><FaLinkedinIn /><FaYoutube />
                </div>
                <div className="footer-bottom">
                    <div className="footer-social-small">
                        <FaFacebookF /><FaInstagram /><FaTwitter /><FaLinkedinIn /><FaYoutube />
                    </div>
                    <p className="copyright">Copyright © SAS 2026 |  UFPB PAS Project</p>
                </div>
            </footer>

            <button 
                className="fab-add-product" 
                onClick={() => setIsModalOpen(true)}
                title="Cadastrar Produto"
            >
                <FaPlus />
            </button>

            {isModalOpen && (
                <ProdutoModal 
                    onClose={() => setIsModalOpen(false)} 
                    onProductCreated={handleProductCreated} 
                />
            )}
        </div>
    );
};

export default Main;
