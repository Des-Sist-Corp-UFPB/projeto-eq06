import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Home.css'
import Card from '../../components/Card/Card';
import ProductCarousel from '../../components/CarouselProduct/ProductCarousel';

const Home = () =>{
    const meuProduto = {
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"
        ]
    };
  return (
    <div>
        

        <ProductCarousel product={meuProduto} />
      <h1>Página Inicial</h1>
      <nav className="container-nav">
        <Link to="/login">
            <Button btnText={"Login"} variant={"White"}/>
        </Link>
        <Link to="/criar-conta">
            <Button btnText={"Criar conta"} variant={"Orange"}/>
        </Link>
        <Link to="/">
            <Button btnText={"Main"} variant={"Orange"}/>
        </Link>
      </nav>
        <Card 
            id={1} 
            imgBaseUrl="src/assets/imagens-testes/ID" 
            name="Sou um produto" 
            price={50.00} 
            address="João Pessoa - PB" 
        />

        <Card 
            id={2} 
            imgBaseUrl="src/assets/imagens-testes/ID" 
            name="Sou um imóvel" 
            price={50000.00} 
            address="Rio Tinto - PB" 
        />
    </div>
  );
}

export default Home;
