// api.js
import { ENDPOINTS } from './constants.js';

export const fetchTipoDeAnalise = async (cnpj) => {
    try {
        const response = await fetch(`${ENDPOINTS.TIPO_DE_ANALISE}?cnpj=${cnpj}`);
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Erro ao buscar Tipo de Análise:', error);
        throw error;
    }
};

export const fetchTabela = async (cnpj, ano, modeloTabela) => {
    try {
        const endpoint = modeloTabela === 'anual'
            ? ENDPOINTS.RESULTADOS_ANUAL(cnpj, ano)
            : ENDPOINTS.RESULTADOS_TRIMESTRAL(cnpj, ano);
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Erro ao buscar a tabela:', error);
        throw error;
    }
};

export const fetchLacsLalur = async (cnpj, ano) => {
    try {
        const response = await fetch(ENDPOINTS.LACS_LALUR(cnpj, ano));
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Erro ao buscar LacsLalur:', error);
        throw error;
    }
};