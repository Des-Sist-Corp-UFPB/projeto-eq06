import React, { useState, useContext, useRef, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import './AdminChat.css';

const AdminChat = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Assistente',
      text: 'Olá! Sou o assistente virtual do administrador. Posso informar a quantidade de produtos ou o valor total do estoque.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'incoming',
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Se não for admin, não deveria acessar (redireciona ou mostra erro)
  useEffect(() => {
    if (user && user.email !== 'admin@gmail.com' && user.email !== 'admin') {
      navigate('/main');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'Você',
      text: trimmedMessage,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'outgoing',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageInput('');

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage })
      });

      if (response.ok) {
        const data = await response.json();
        const replyMessage = {
          id: Date.now() + 1,
          sender: 'Assistente',
          text: data.reply,
          time: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'incoming',
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      } else {
        throw new Error('Falha na resposta do servidor');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Assistente',
        text: 'Desculpe, ocorreu um erro ao conectar com o servidor.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: 'incoming',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="admin-chat-page">
      <Header />
      <main className="admin-chat-main">
        <section className="admin-chat-panel">
          <div className="admin-chat-topbar">
            <button type="button" className="admin-chat-back" onClick={() => navigate(-1)}>
              Voltar
            </button>
            <div className="admin-chat-title">
              <FiMessageSquare size={20} />
              <div>
                <h1>Assistente de Gerência</h1>
                <p>Informações e relatórios em tempo real</p>
              </div>
            </div>
          </div>

          <div className="admin-chat-window">
            <div className="admin-chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`admin-chat-message ${message.type}`}
                >
                  <div className="admin-message-header">
                    <span className="admin-message-sender">{message.sender}</span>
                    <span className="admin-message-time">{message.time}</span>
                  </div>
                  <p className="admin-message-text">{message.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="admin-chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Pergunte sobre produtos ou valor total..."
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
              />
              <Button typeBtn="submit" btnText="Enviar" variant="Orange" />
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminChat;
