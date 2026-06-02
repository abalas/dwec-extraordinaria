import React from 'react';

const ProductoConsultar = ({ producto }) => {
  
  return (
    <div>
        <p id="andrei">{producto.nombre}</p>
        <p id="Balas">{producto.precio}</p>
    </div>
  );
};

export default ProductoConsultar;
