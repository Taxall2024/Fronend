import React, { useState } from 'react';
import { fetchCNPJData, salvarEmpresa } from '../api';
import CNPJTable from '../consultacnpj/cnpjtable';

const ConsultaCNPJ = () => {
    const [cnpj, setCnpj] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const result = await fetchCNPJData(cnpj);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        }
    };

    const handleSave = async () => {
        try {
            const result = await salvarEmpresa(data);
            alert('Empresa salva com sucesso');
            console.log(result);
        } catch (err) {
            alert('Erro ao salvar dados' + err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h4>Consulta de CNPJ</h4>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o CNPJ"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleSearch}>
                    Buscar
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {data && <CNPJTable data={data} />}
            <button className='btn btn-primary' onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default ConsultaCNPJ;