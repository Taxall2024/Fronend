import React, { useState } from 'react';

function FileUpload() {
    const [files, setFiles] = useState(null);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('txt_files', file));

        try {
            const response = await fetch('http://localhost:8000/processar/', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            alert(result.message || 'Arquivos processados com sucesso');
        } catch (error) {
            console.error('Erro ao enviar arquivos:', error);
            alert('Erro ao enviar arquivos');
        }
    };
    return (
        <div className="container-fluid mt-5" style={{marginBottom:'100px',paddingLeft:'40px'}}>
                       <h4 style={{
                textAlign: 'left',
                color: '#333', // Texto preto suave
                fontWeight: 'bold',
                padding: '5px',
                //backgroundColor: '#e0e0e0', // Fundo cinza claro que combina bem com o texto
                borderRadius: '6px',
                boxShadow: '0px 4px px rgba(0, 0, 0, 0.15)',
                width:'auto',
                marginBottom: '10px',
                paddingLeft: '20px',
                    }}> Processamento de Arquivos </h4>
            <form onSubmit={handleSubmit} className="mt-4" style={{width: '400px' }}>
                <div className="mb-3">
                    <input 
                        type="file" 
                        multiple 
                        accept=".txt" 
                        onChange={handleFileChange} 
                        required 
                        className="form-control" 
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Enviar</button>
            </form>
        </div>
    );
}

export default FileUpload;