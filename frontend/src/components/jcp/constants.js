// constants.js
export const API_BASE_URL = 'http://localhost:8000';
export const ENDPOINTS = {
    RECALCULAR_LACS: `${API_BASE_URL}/apos-inovacoes-anual/recalcular-lacs`,
    TIPO_DE_ANALISE: `${API_BASE_URL}/tipo-de-analise/`,
    RESULTADOS_ANUAL: (cnpj, ano) => `${API_BASE_URL}/resultados/${cnpj}-${ano}/`,
    RESULTADOS_TRIMESTRAL: (cnpj, ano) => `${API_BASE_URL}/resultados/trimestral/?cnpj=${cnpj}&ano=${ano}`,
    LACS_LALUR: (cnpj, ano) => `${API_BASE_URL}/lacslalur/${cnpj}-${ano}/`
};