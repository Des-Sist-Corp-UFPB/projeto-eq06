import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { AuthContext } from '../../context/AuthContext';
import './Audit.css';

export default function Audit() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [inputPage, setInputPage] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const TAMANHO_PAGINA = 15;

    useEffect(() => {
        // Permissão simples: Apenas admin pode ver a auditoria
        if (user && user.email !== 'admin') {
            navigate('/main');
        } else {
            fetchLogs();
        }
    }, [user, navigate, pagina]);

    const handlePageJump = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(inputPage, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            setPagina(pageNumber - 1);
            setInputPage('');
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/auditoria?pagina=${pagina}&tamanho=${TAMANHO_PAGINA}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.content || []);
                setTotalPages(data.totalPages || 1);
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
                    <>
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
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPagina(prev => Math.max(prev - 1, 0))}
                                    disabled={pagina === 0}
                                >
                                    Anterior
                                </button>
                                <span className="pagination-info">
                                    Página {pagina + 1} de {totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPagina(prev => Math.min(prev + 1, totalPages - 1))}
                                    disabled={pagina >= totalPages - 1}
                                >
                                    Próxima
                                </button>

                                <form onSubmit={handlePageJump} className="pagination-jump">
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={inputPage}
                                        onChange={(e) => setInputPage(e.target.value)}
                                        className="pagination-input"
                                    />
                                    <button type="submit" className="pagination-btn">Ir</button>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
