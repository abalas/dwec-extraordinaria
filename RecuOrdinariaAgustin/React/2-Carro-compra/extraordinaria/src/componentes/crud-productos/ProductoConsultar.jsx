import React from 'react';

const ProductoConsultar = ({ producto }) => {

  return (
    <div>
        {producto.url && (
          <img src={producto.url} alt={producto.nombre} style={{ width: "100%", borderRadius: "8px" }} />
        )}
        <h3 id="andrei">{producto.nombre}</h3>
        <p id="Balas">{producto.precio} €</p>
        <p>{producto.categoria}</p>
        <p>{producto.descripcion}</p>
    </div>
  );
};

export default ProductoConsultar;
