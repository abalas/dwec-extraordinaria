// Elementos del DOM 
let totalProductos = document.getElementById("idNumTotal");
let importeTotal = document.getElementById("idImporteTotal");
let productSelect = document.getElementById("idSelectorProductos");
let productoList = document.getElementById("idlistaProductos");

let productosData = [];
let informacion = new Map();

let arrayProductos

let precioTotal = 0
let cantidad =0

// Cargar productos desde el JSON
fetch('productos.json')
    .then(response => {
        if (!response.ok) throw new Error("No encontrado");
        return response.json()
      
    })
    .then(data => {
        arrayProductos = data.productos
        data.productos.forEach(element => {
            productSelect.innerHTML += `<option value="${element.identificador}"> ${element.info} - ${element.pvp}</option>></option>`
        }
    );
        
        
        productSelect.addEventListener("change", function (e) {

            let li = document.querySelectorAll(".nuevo-producto-rojo")

            li.forEach(element => element.classList.remove("nuevo-producto-rojo"))

            console.log(`${this.value}`)
            let id = `${this.value}`
            let precio = arrayProductos[id].pvp
            let nombre = arrayProductos[id].info
            productoList.innerHTML += `<li class="product-item nuevo-producto-rojo" data-id="${this.value} data-pvp${precio} title="Doble ckick para eliminar el producto">
            <span class="product-info">${nombre}</span>
            <span class="product-price">${precio}</span>
            </li>`

            precioTotal += precio
            cantidad +=1

            importeTotal.innerHTML=parseFloat(precioTotal,2)
            totalProductos.innerHTML=cantidad

        })
    


      
    })
    .catch(error => {
        alert("mal")
        console.log("Error al cargar los productos:", error)
       
    });



