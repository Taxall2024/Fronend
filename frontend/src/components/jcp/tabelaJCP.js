import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TabelaJCP() {
    const [empresas, setEmpresas] = useState([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ano, setAno] = useState('');
    
    const [tabela, setTabela] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editedRowData, setEditedRowData] = useState({});
    const [modeloTabela, setModeloTabela] = useState('anual'); 

    const [tipoDeAnalise, setTipoDeAnalise] = useState([])

    const [lacsLalurTabela, setLacsLalurTabela] = useState([])
    const [editingLacsLalurRowIndex, setEditingLacsLalurRowIndex] = useState(null);
    const [editedLacsLalurRowData, setEditedLacsLalurRowData] = useState({});

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await fetch('http://localhost:8000/empresas/');
                const result = await response.json();
                if (result.data) {
                    setEmpresas(result.data);
                } else {
                    alert(result.message || 'Erro ao carregar empresas');
                }
            } catch (error) {
                console.error('Erro ao buscar empresas:', error);
            }
        };
        fetchEmpresas();
    }, []);
    
    const handleEmpresaChange = (e) => {
    const nomeSelecionado = e.target.value;
    setEmpresaSelecionada(nomeSelecionado);


    const empresaEncontrada = empresas.find((empresa) => empresa.nome_da_empresa === nomeSelecionado);
    if (empresaEncontrada) {
        setCnpj(empresaEncontrada.cnpj); 
        fetchTipoDeAnalise(empresaEncontrada.cnpj);
    } else {
        setCnpj(''); 
        setTipoDeAnalise([]);
    }
};
    const handleLacsLalurEdit = (index, row) => {
        setEditingLacsLalurRowIndex(index);
        setEditedLacsLalurRowData(row);
    };

    const handleLacsLalurSave = async (index) => {
        const newLacsLalurTabela = [...lacsLalurTabela];
        newLacsLalurTabela[index] = editedLacsLalurRowData;
        setLacsLalurTabela(newLacsLalurTabela);
        setEditingLacsLalurRowIndex(null);


        console.log("Tabela enviada para o backend:", newLacsLalurTabela);
        
        try {
            const endpoint = modeloTabela === 'anual'
            ? 'http://localhost:8000/apos-inovacoes-anual/recalcular-lacslalur/'
            : 'http://localhost:8000/recalcular/trimestral/';
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLacsLalurTabela),
            
        });
    
            
            const newTabelaResponseLacs = await response.json();
            
            if (newTabelaResponseLacs.data && Array.isArray(newTabelaResponseLacs.data)) {
                setTabela(newTabelaResponseLacs.data);
            } else {
                console.log("Tabela de volta:", newTabelaResponseLacs);
                alert("Erro ao atualizar a tabela: formato de resposta inesperado.");
            }
        } catch (error) {
            console.error("Erro ao recalcular a tabela:", error);
            alert("Erro ao recalcular a tabela.");
        }
    };
    

const atualizar = async (index) => {
    const updatetable = [...tabela]; // Dados alterados da linha
    const endpoint = modeloTabela === 'anual'
        ? 'http://localhost:8000/atualizar-tabela/atualizar-anual/'
        : 'http://localhost:8000/atualizar-tabela/atualizar-trimestral/';

    const payload = {
        cnpj: cnpj, // CNPJ da empresa selecionada
        ano: ano,   // Ano selecionado
        dados: updatetable, // Dados alterados da linha
    };

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            // Atualize a tabela localmente após o sucesso
            setTabela(updatetable);
            setEditingRowIndex(null);
            alert(result.message || "Atualização bem-sucedida!");
        } else {
            alert(result.error || "Erro ao atualizar a tabela");
        }
    } catch (error) {
        console.error("Erro ao salvar a tabela:", error);
        alert("Erro ao salvar as alterações");
    }
};

    const fetchTipoDeAnalise = async (cnpj) => {
    try {
        const response = await fetch(`http://localhost:8000/tipo-de-analise/?cnpj=${cnpj}`);
        const result = await response.json();
        if (result.data) {
            setTipoDeAnalise(result.data); // Atualiza o estado com os dados recebidos
        } else {
            alert(result.message || 'Erro ao buscar Tipo de Análise');
        }
    } catch (error) {
        console.error('Erro ao buscar Tipo de Análise:', error);
    }
};

    const buscarTabela = async () => {
        if (!cnpj || !ano) {
           
            return;
        }

        try {
            const endpoint = modeloTabela === 'anual'
                ? `http://localhost:8000/resultados/${cnpj}-${ano}/`
                : `http://localhost:8000/resultados/trimestral/?cnpj=${cnpj}&ano=${ano}`; 
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

    const LacsLalur = async () => {
        if (!cnpj || !ano) {
           
            return;
        }

        try {
            const endpoint = modeloTabela === 'anual'
                ? `http://localhost:8000//apos-inovacoes-anual/lacslalur/${cnpj}-${ano}/`
                : ``; 
            const response = await fetch(endpoint);
            const result = await response.json();
            
            console.log(result);

            if (Array.isArray(result.data)) {
                setLacsLalurTabela(result.data);
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
            ? 'http://localhost:8000/recalcular/anual/'
            : 'http://localhost:8000/recalcular/trimestral/';
    
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
        buscarTabela();
    }, [modeloTabela]);
    useEffect(() => {
        console.log('CNPJ Selecionado:', cnpj);
    }, [cnpj]);
    return (
        <div className="container mt-4" style={{ marginTop: '40px', marginLeft: '20px', maxWidth: '80%' }}>
            <h4
                style={{
                    textAlign: 'left',
                    paddingLeft: '50px',
                    color: '#333', // Texto preto suave
                    fontWeight: 'bold',
                    borderRadius: '26px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                    marginBottom: '5px',
                }}
            >
                Tabela JCP
            </h4>
    
            {/* Contêiner principal para alinhar elementos lado a lado */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                {/* Inputs e seletores */}
                <div>
                    <select
                        className="form-select mb-2"
                        style={{ width: '200px', textAlign: 'center' }}
                        value={empresaSelecionada}
                        onChange={handleEmpresaChange}
                    >
                        <option value="">Selecione uma empresa</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.cnpj} value={empresa.nome_da_empresa}>
                                {empresa.nome_da_empresa}
                            </option>
                        ))}
                    </select>
    
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Ano"
                        style={{ width: '200px', textAlign: 'center' }}
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                    />
    
                    <select
                        className="form-select mb-2"
                        style={{ width: '200px', textAlign: 'center' }}
                        value={modeloTabela}
                        onChange={(e) => setModeloTabela(e.target.value)}
                    >
                        <option value="anual">Anual</option>
                        <option value="trimestral">Trimestral</option>
                    </select>
                <button className="btn btn-primary mt-2" onClick={buscarTabela}>
                        Buscar Tabela
                </button>

                </div>
    
                {/* Tabela compacta */}
                <table
                    className="table table-sm"
                    style={{ width: '300px', fontSize: '14px', textAlign: 'center' }}
                >
                    <thead>
                        <tr>
                            <th>Ano</th>
                            <th>Tipo Análise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipoDeAnalise.length > 0 ? (
                            tipoDeAnalise.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.periodo_de_analise}</td>
                                    <td>{item.tipo_da_analise}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Nenhum dado encontrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div  style={{display:'flex',flexDirection:'column',gap:'10px'}}>            
                <button className="btn btn-outline-warning" onClick={atualizar}>
                        Salvar Alterações
                </button>
                <button className="btn btn-secondary" onClick={LacsLalur}>
                    Buscar LacsLalur
                </button>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            </div>
            </div>


            </div>
            
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>                 
            {Array.isArray(tabela) && tabela.length > 0 ? (
                <table className="table table-striped table-hover mt-4"
                style={{ width: '700px', fontSize: '14px', textAlign: 'center' }}>
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
                  {/* Nova Tabela LacsLalur */}
        <table
            className="table table-striped table-hover mt-4"
            style={{ width: '500px', fontSize: '14px', textAlign: 'center' }}
        >
            <thead>
                <tr>
                    <th>Operação Lacs e Lalur</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
            {lacsLalurTabela.length > 0 ? (
                    lacsLalurTabela.map((row, index) => (
                        <tr key={index}>
                            {editingLacsLalurRowIndex === index ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="operation"
                                            value={editedLacsLalurRowData.operation}
                                            onChange={(e) => setEditedLacsLalurRowData({ ...editedLacsLalurRowData, operation: e.target.value })}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="value"
                                            value={editedLacsLalurRowData.value}
                                            onChange={(e) => setEditedLacsLalurRowData({ ...editedLacsLalurRowData, value: e.target.value })}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => handleLacsLalurSave(index)}>Salvar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{row.operation}</td>
                                    <td>{row.value}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={() => handleLacsLalurEdit(index, row)}>Editar</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">Nenhum dado encontrado</td>
                    </tr>
                )}
            </tbody>
        </table>
        </div>
        </div>
    );
}

export default TabelaJCP;