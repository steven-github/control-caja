import React from "react";

const DataList = ({ data }) => {
  return (
    <div>
      <h2>Montos:</h2>
      <ul>
        {data.map((data, index) => (
          <li key={index}>
            Cantidad: {data.amount}, Tipo de pago: {data.payment} Hora: {data.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
