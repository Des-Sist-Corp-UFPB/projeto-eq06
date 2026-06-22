import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { AuthContext } from '../../context/AuthContext';
import './Audit.css';

export default function Audit() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Permissão simples: Apenas admin pode ver a auditoria
        if (user && user.email !== 'admin') {
            navigate('/main');
        } else {
            fetchLogs();
        }
    }, [user, navigate]);

    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/auditoria?tamanho=50');
            if (response.ok) {
                const data = await response.json();
                setLogs(data.content || []);
            }
        } catch (error) {
            console.error('Erro ao buscar logs de auditoria:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="audit-page">
            <Header />
            <div className="audit-container">
                <h2>Painel de Auditoria</h2>
                <p>Histórico de ações críticas do sistema.</p>
                
                {loading ? (
                    <p>Carregando logs...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data / Hora</th>
                                    <th>Ação</th>
                                    <th>Usuário</th>
                                    <th>IP</th>
                                    <th>Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{log.id}</td>
                                        <td>{new Date(log.criadoEm).toLocaleString('pt-BR')}</td>
                                        <td>
                                            <span className={`badge ${log.acao.includes('FAILURE') ? 'failure' : 'success'}`}>
                                                {log.acao}
                                            </span>
                                        </td>
                                        <td>{log.usuario}</td>
                                        <td>{log.ipAddress}</td>
                                        <td className="details-cell" title={log.detalhes}>{log.detalhes}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">Nenhum log encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
