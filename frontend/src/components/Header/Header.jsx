import { useContext, useState } from 'react'; // Importe o useContext
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiLogOut, FiShield, FiMessageSquare } from "react-icons/fi";
import { FaCircleUser } from 'react-icons/fa6';
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import "./Header.css";

function Header({ onSearch }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchValue(val);
        if (onSearch) {
            onSearch(val);
        }
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchValue);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/main">
                    <img className="pbx-logo" src={pbxLogo} alt="Logo" />
                </Link>
            </div>
            
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Buscar produtos, casas..." 
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <FiSearch className="search-icon" onClick={handleSearchClick} style={{ cursor: 'pointer' }} />
            </div>

            <div className="header-actions">
                {!user ? (
                    <div className="auth-buttons">
                        <Link to="/login">
                            <Button btnText={"Entrar"} variant={"White"} />
                        </Link>
                        <Link to="/criar-conta">
                            <Button btnText={"Criar conta"} variant={"Orange"} />
                        </Link>
                        <div className="header-icons">
                            <Link to="/login">
                                <FiHeart />
                            </Link>
                            <Link to="/login">
                                <FiShoppingCart />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="container-user">
                        <div className="header-icons">
                            <Link to='/favorites'>
                                <FiHeart />
                            </Link>
                            <Link to="/carrinho">
                                <FiShoppingCart />
                            </Link>
                            {user.email === 'admin' && (
                                <>
                                    <Link to="/auditoria" title="Painel de Auditoria">
                                        <FiShield />
                                    </Link>
                                    <Link to="/admin/chat" title="Assistente Gerencial">
                                        <FiMessageSquare />
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className={"user-info"}>
                            <span className={"user-welcome"}>Olá, {user.name}</span>
                            <FaCircleUser />
                            <FiLogOut onClick={handleLogout} className={"logout-button"} title="Sair" />
                        </div>
                        
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
