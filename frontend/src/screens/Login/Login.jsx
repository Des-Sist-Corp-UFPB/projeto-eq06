import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Button from "../../components/Button/Button";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");

  const [adminEmail, setAdminEmail] = useState("");
  const [adminSenha, setAdminSenha] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSenha, setUserSenha] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e, type) => {
    e.preventDefault();
    const emailToUse = type === 'admin' ? adminEmail : userEmail;
    const senhaToUse = type === 'admin' ? adminSenha : userSenha;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, senha: senhaToUse })
      });

      if (response.ok) {
        const userData = await response.json();
        // Login aprovado pelo backend
        login({ id: userData.id, email: userData.email, name: userData.nome });
        navigate("/main");
      } else if (response.status === 401) {
        toast.error("Usuário ou senha inválidos!");
      } else {
        toast.error("Erro interno do servidor.");
      }
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      toast.error("Falha ao comunicar com o servidor.");
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="logo">
        <img className="pbx-logo" src={pbxLogo} alt="" />
      </div>

      <div className="login-areas">
        <div className="card">
          <div className="tab-container">
            <button
              className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              Usuário
            </button>
            <button
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Administrador
            </button>
          </div>

          {activeTab === 'user' ? (
            <div className="login-form">
              <label>Email do Usuário</label>
              <input
                type="text"
                placeholder="usuario@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <label>Senha</label>
              <div className="password-field">
                <input
                  type="password"
                  placeholder="********"
                  value={userSenha}
                  onChange={(e) => setUserSenha(e.target.value)}
                />
              </div>

              <Button typeBtn="button" btnFunction={(e) => handleLogin(e, 'user')} btnText={"Entrar"} variant={"Orange"} />
            </div>
          ) : (
            <div className="login-form">
              <h2 className="card-title">Acesso Administrativo</h2>
              <label>Email do Admin</label>
              <input
                type="text"
                placeholder="admin"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />

              <label>Senha</label>
              <div className="password-field">
                <input
                  type="password"
                  placeholder="********"
                  value={adminSenha}
                  onChange={(e) => setAdminSenha(e.target.value)}
                />
              </div>

              <Button typeBtn="button" btnFunction={(e) => handleLogin(e, 'admin')} btnText={"Entrar"} variant={"Orange"} />
            </div>
          )}
        </div>
      </div>

      <p className="forgot">Esqueceu sua senha?</p>
    </div>
  );
}
