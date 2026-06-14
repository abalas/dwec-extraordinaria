// Elementos del DOM 
let totalProductos = document.getElementById("idNumTotal");
let importeTotal = document.getElementById("idImporteTotal");
let productSelect = document.getElementById("idSelectorProductos");
let productoList = document.getElementById("idlistaProductos");

let precioMedioPorProducto= document.getElementById("idPrecioMedioProducto")

let productosData = [];
let informacion = new Map();

let arrayProductos

// Cargar productos desde el JSON
fetch("productos.json")
    .then(response => {
        if (respuesta.ok){
            return response.json()
        }else{
            throw new Error(`Error del servidor: Status ${respuesta.status}`)
        }
        
      
    })
    .then(data => {
        arrayProductos = data.productos
        console.log(arrayProductos)
        arrayProductos.forEach(element => {
            productSelect.innerHTML += `<option value=${element.identificador}>${element.info} - ${element.pvp}</option>`
        });
        productSelect.addEventListener("change", aniadirCesta )
      
    })
    .catch(error => {
       console.log("Ha ocurrido un error en la peticion " + error.message)
    });

function aniadirCesta(){
    //alert(`${this.value}`)
    let id = this.value
    let precio = arrayProductos[id].pvp
    let nombre = arrayProductos[id].info

    //cogemos todos los que sean rojos y les quitamos la etiqueta
    let rojos = document.querySelectorAll(".nuevo-producto-rojo")
    rojos.forEach(element => {
        element.classList.remove("nuevo-producto-rojo")
    });


    productoList.innerHTML += `<li class="product-item nuevo-producto-rojo"  data-id=${id} data-pvp=${precio}>
        <div class="product-info">
            <span class="product-name">${nombre}</span>
            <span class="product-price">${precio} </span>
        </div>
    </li>`

    totalProductos.innerHTML = parseInt(totalProductos.innerHTML) + 1
    importeTotal.innerHTML =  (parseFloat(importeTotal.innerHTML) + parseFloat(precio)).toFixed(2)
    precioMedioPorProducto.innerHTML =  (parseFloat(importeTotal.innerHTML)/ parseFloat(totalProductos.innerHTML)).toFixed(2)




}

let resumen = document.getElementById("idResumen")

resumen.addEventListener("click", eliminarListaProductos)

function eliminarListaProductos() {
    alert("Se han eliminado los productos")
    productoList.innerHTML=""

    totalProductos.innerHTML = 0
    importeTotal.innerHTML = 0
}