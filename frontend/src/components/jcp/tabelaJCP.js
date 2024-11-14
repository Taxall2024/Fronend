import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TabelaJCP() {
    const [cnpj, setCnpj] = useState('');
    const [ano, setAno] = useState('');
    const [tabela, setTabela] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editedRowData, setEditedRowData] = useState({});
    const [modeloTabela, setModeloTabela] = useState('anual'); // Estado para alternar entre anual e trimestral

    const buscarTabela = async () => {
        try {
            const endpoint = modeloTabela === 'anual'
                ? `http://localhost:8000/tabelaanual/${cnpj}/${ano}/`
                : `http://localhost:8000/tabelatrimestral/${cnpj}/${ano}/`; // Alterna API com base no modelo
            const response = await fetch(endpoint);
            const result = await response.json();
            
            console.log(result);

            if (Array.isArray(result.data)) {
                setTabela(result.data);
            } else {
                alert(result.message || 'Erro ao buscar a tabela');
            }
        } catch (error) {
            console.error('Erro ao buscar a tabela:', error);
            alert('Erro ao buscar a tabela');
        }
    };

    const handleEdit = (index, row) => {
        setEditingRowIndex(index);
        setEditedRowData(row);
    };

    const handleSave = async (index) => {
        const newTabela = [...tabela];
        newTabela[index] = editedRowData;
        setTabela(newTabela);
        setEditingRowIndex(null);

        console.log("Tabela enviada para o backend:", newTabela);
        
        try {
            const endpoint = modeloTabela === 'anual'
            ? 'http://localhost:8000/recalcular_tabela_jcp/'
            : 'http://localhost:8000/recalcular_tabela_trimestral_jcp/';
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTabela),
            
        });
    
            
            const newTabelaResponse = await response.json();
            
            if (newTabelaResponse.data.data && Array.isArray(newTabelaResponse.data.data)) {
                setTabela(newTabelaResponse.data.data);
            } else {
                alert("Erro ao atualizar a tabela: formato de resposta inesperado.");
            }
        } catch (error) {
            console.error("Erro ao recalcular a tabela:", error);
            alert("Erro ao recalcular a tabela.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedRowData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        console.log('Tabela atualizada:', tabela);
    }, [tabela]);
    
    return (
        <div className="container mt-4" style={{ marginTop:'40px', marginLeft: '20px', maxWidth: '50%' }}>
            <h4 style={{
                textAlign: 'left',
                paddingLeft:'50px',
                color: '#333', // Texto preto suave
                fontWeight: 'bold',
                //backgroundColor: '#e0e0e0', // Fundo cinza claro que combina bem com o texto
                borderRadius: '26px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                marginBottom: '5px'
                    }}>  Tabela JCP</h4>
                    <div className="mb-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    style={{width: '200px',textAlign:'center' }}
                    placeholder="CNPJ"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                />
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Ano"
                    style={{width: '200px',textAlign:'center' }}
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                />

                {/* Select para escolher o modelo de tabela */}
                <select
                    className="form-select mb-2"
                    style={{width: '200px',textAlign:'center' }}
                    value={modeloTabela}
                    onChange={(e) => setModeloTabela(e.target.value)}
                >
                    <option value="anual">Anual</option>
                    <option value="trimestral">Trimestral</option>
                </select>

                <button className="btn btn-primary" onClick={buscarTabela}>Buscar Tabela</button>
            </div>

            {Array.isArray(tabela) && tabela.length > 0 ? (
                <table className="table table-striped table-hover mt-4">
                    <thead className="thead-dark">
                        <tr>
                            <th>CNPJ</th>
                            <th>Ano</th>
                            {modeloTabela === 'anual' ? (
                                <>
                                    <th>Operação</th>
                                    <th>Valor</th>
                                </>
                            ) : (
                                // Renderiza colunas específicas para o modelo trimestral
                                <>
                                    <th>Operação</th>
                                    <th>Valor 1° Trimestre</th>
                                    <th>Valor 2° Trimestre</th>
                                    <th>Valor 3° Trimestre</th>
                                    <th>Valor 4° Trimestre</th>
                                    
                                </>
                            )}
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tabela.map((row, index) => (
                            <tr key={`${row.cnpj}-${index}`}>
                                <td>{row.cnpj}</td>
                                <td>{row.ano}</td>
                                {modeloTabela === 'anual' ? (
                                    <>
                                        {editingRowIndex === index ? (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="operation"
                                                        value={editedRowData.operation}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="value"
                                                        value={editedRowData.value}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.operation}</td>
                                                <td>{row.value}</td>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {editingRowIndex === index ? (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="operation_1_trimestre"
                                                        value={editedRowData.operation_1_trimestre}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="value_1_trimestre"
                                                        value={editedRowData.value_1_trimestre}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="value_2_trimestre"
                                                        value={editedRowData.value_2_trimestre}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="value_3_trimestre"
                                                        value={editedRowData.value_3_trimestre}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="value_4_trimestre"
                                                        value={editedRowData.value_4_trimestre}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.operation_1_trimestre}</td>
                                                <td>{row.value_1_trimestre}</td>
                                                <td>{row.value_2_trimestre}</td>
                                                <td>{row.value_3_trimestre}</td>
                                                <td>{row.value_4_trimestre}</td>
                                            </>
                                        )}
                                    </>
                                )}
                                <td>
                                    {editingRowIndex === index ? (
                                        <button className="btn btn-success" onClick={() => handleSave(index)}>Salvar</button>
                                    ) : (
                                        <button className="btn btn-warning" onClick={() => handleEdit(index, row)}>Editar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum dado disponível para exibir.</p>
            )}
        </div>
    );
}

export default TabelaJCP;
