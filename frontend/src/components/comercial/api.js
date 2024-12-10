import { ENDPOINTS } from './constants';

export const fetchCNPJData = async (cnpj) => {
    try {
        const response = await fetch(`${ENDPOINTS.CONSULTA_CNPJ}?cnpj=${cnpj}`);
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            throw new Error(result.error || 'Erro ao buscar dados do CNPJ');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do CNPJ:', error);
        throw error;
    }
};


export const salvarEmpresa = async (data) => {
    try {
        const response = await fetch(ENDPOINTS.SALVAR_EMPRESA, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            return result;
        } else {
            throw new Error(result.error || 'Erro ao salvar dados da empresa');
        }
    } catch (error) {
        console.error('Erro ao salvar dados da empresa:', error);
        throw error;
    }
};