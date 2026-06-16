import "./Card.css";
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Button from "../Button/Button";

function Card({ 
    id,
    name, 
    price, 
    address, 
    imgBaseUrl,
    isAdmin,
    onDelete,
    isFavorite,
    onToggleFavorite
}) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);

    const imagePath = imgBaseUrl;

    return (
        <article id={`card-${id}`} className="container-card">
            <div className="container-img">
                <div className="card-actions-top">
                    {isAdmin && (
                        <button className="container-trash" aria-label="Excluir produto" onClick={() => onDelete(id)}>
                            <FiTrash2 aria-hidden="true" className="trash-img"/>
                        </button>
                    )}
                    <button className="container-heart" aria-label="Adicionar aos favoritos" onClick={() => onToggleFavorite && onToggleFavorite(id, !isFavorite)}>
                        {isFavorite ? <FaHeart color="#ee7b5b" className="heart-img" /> : <FiHeart className="heart-img"/>}
                    </button>
                </div>
                <img className="image-product" src={imagePath} alt={`Foto do produto ${name}`} />
            </div>

            <div className="container-info-product">
                <h3 className="name-product">{name}</h3>
                <p className="price-product">{formattedPrice}</p>
                <p className="address-seller">{address}</p>
            </div>
            
            <div className="container-button">
                <Link to={`/info/${id}`} className="link-details">
                    <Button 
                        btnText="Learn more"
                        variant="Orange"
                    />
                </Link>
            </div>
        </article>
    );
}

export default Card;