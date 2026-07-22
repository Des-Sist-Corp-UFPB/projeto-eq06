import React, { useState, useContext, useEffect  } from 'react';
import axios from 'axios'; 
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import './Chat.css';

const Chat = () => {
  const navigate = useNavigate();
  const { produtoId } = useParams();
  const { user } = useContext(AuthContext);

  // Estrutura conceitual da conversa:
  // {
  //   produtoId: número,        // ID do produto (da URL)
  //   compradorId: número,      // ID do usuário logado (user.id)
  //   vendedorId: número        // ID do vendedor (será obtido do backend futuramente)
  // }
  // Esta estrutura permite identificar conversas únicas por produto e usuários envolvidos

  const compradorId = user?.id;
  const vendedorId = 2; // TODO: Obter do produto quando API fornecer

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Você',
      text: 'Olá! Esse produto ainda está disponível?',
      time: '09:03',
      type: 'outgoing',
    },
    {
      id: 2,
      sender: 'Vendedor',
      text: 'Sim, está disponível. Quer agendar uma visita?',
      time: '09:06',
      type: 'incoming',
    },
    {
      id: 3,
      sender: 'Você',
      text: 'Perfeito, podemos marcar para amanhã.',
      time: '09:08',
      type: 'outgoing',
    },
  ]);

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `/api/mensagens/produto/${produtoId}?userId=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatadas = (data || []).map((msg) => ({
          id: msg.id,
          sender: Number(msg.remetenteId) === Number(user.id) ? "Você" : "Vendedor",
          text: msg.texto,
          time: new Date(msg.enviadaEm).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: Number(msg.remetenteId) === Number(user.id) ? "outgoing" : "incoming",
        }));
        setMessages(formatadas);
      });
  }, [produtoId, user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !user?.id) return;

    const newMessage = {
      id: Date.now(),
      sender: "Você",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "outgoing",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    try {
      await fetch("/api/mensagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtoId: Number(produtoId),
          remetenteId: user.id,
          texto: trimmedMessage,
        }),
      });
    } catch (err) {
      console.error(err);

      // Remove a mensagem adicionada localmente se o envio falhar
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const perguntarIA = async (event) => {
    event.preventDefault();

    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !user?.id) return;

    const mensagemUsuario = {
      id: Date.now(),
      sender: "Você",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "outgoing",
    };

    // Mostra a mensagem do usuário imediatamente
    setMessages((prev) => [...prev, mensagemUsuario]);
    setMessageInput("");

    try {
      const respostaIA = await axios.post(
        "/api/chat/ia",
        {
          mensagem: trimmedMessage,
        }
      );

      const mensagemIA = {
        id: Date.now() + 1,
        sender: "Assistente IA",
        text: respostaIA.data,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "incoming",
      };

      setMessages((prev) => [...prev, mensagemIA]);

    } catch (erro) {
      console.error(erro);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "Assistente IA",
          text: "Desculpe, não consegui responder agora.",
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "incoming",
        },
      ]);
    }
  };
  return (
    <div className="chat-page">
      <Header />
      <main className="chat-main">
        <section className="chat-panel">
          <div className="chat-topbar">
            <button type="button" className="chat-back" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <div className="chat-title">
              <FiMessageSquare size={20} />
              <div>
                <h1>Chat com o vendedor</h1>
                <p>Converse diretamente com o anunciante</p>
              </div>
            </div>
          </div>

          <div className="vendor-card">
            <div className="vendor-avatar">HS</div>
            <div className="vendor-info">
              <strong>Henrique Santos</strong>
              <span>Vendedor</span>
              <span>henrique@email.com</span>
            </div>
          </div>

          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.type}`}
                >
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-time">{message.time}</span>
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
              />

              <Button
                typeBtn="button"
                btnText="Perguntar IA"
                variant="Orange"
                onClick={perguntarIA}
              />

              <Button
                typeBtn="submit"
                btnText="Enviar"
                variant="Orange"
              />

            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chat;
