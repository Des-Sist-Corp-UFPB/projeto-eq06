import React, { useState, useEffect } from "react";
import "./Main.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";

const bannerImages = [
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
];

const productsData = [
    { id: 1, image: 'https://images.unsplash.com/photo-1671438118097-479e63198629?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Camisa Polo - Cores', price: 50.00, local: 'Local - PB' },
    { id: 2, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', title: 'Camiseta V - Cores', price: 25.00, local: 'Local - PB' },
    { id: 3, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', title: 'Calça Jeans', price: 100.00, local: 'Local - PB' },
    { id: 4, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Casa - 150m²', price: 4750.00, local: 'Local - PB' },
    { id: 5, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', title: 'Apartamento no centro - 70m²', price: 1999.00, local: 'Local - PB' },
    { id: 6, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', title: 'Casa com piscina - 270m²', price: 7000.00, local: 'Local - PB' },
];

const Main = () => {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pbx-container">
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
                <div className="product-grid">
                    {productsData.map((product) => (
                        <Card key={product.id} id={product.id} imgBaseUrl={product.image} name={product.title} price={product.price} address={product.local}/>
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
        </div>
    );
};

export default Main;
