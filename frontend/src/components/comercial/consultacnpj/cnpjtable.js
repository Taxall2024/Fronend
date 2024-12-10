import React from 'react';

const CNPJTable = ({ data }) => {
    return (
        <div>
            <h5>Consulta Receita</h5>
            <table className="table table-hover">
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <th>{key}</th>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CNPJTable;



