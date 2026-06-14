

// Elementos del DOM 
let totalProductos = document.getElementById("idNumTotal");
let importeTotal = document.getElementById("idImporteTotal");
let productSelect = document.getElementById("idSelectorProductos");
let productoList = document.getElementById("idlistaProductos");



let productosData = [];
let informacion = new Map();

// Cargar productos desde el JSON
fetch("productos.json")
    .then(response => {
      return response.json()
    })
    .then(data => {
      //console.log(data)
      let producto = document.createElement("option")
        productosData = data.productos
        console.log(productosData)



      data.productos.forEach(element => {
        //console.log(element.info)
        let producto = document.createElement("option")
        producto.textContent = `${element.info} - ${element.pvp}€`
        producto.value = `${element.identificador}`
//        producto.addEventListener("onselect", funcion)
        productSelect.appendChild(producto)

      });



      productSelect.addEventListener("change", function(e){
            id = `${this.value}`
            console.log("Hola")
            console.log(`${this.value}`)
            producto = document.createElement("li")
            producto.setAttribute("datta-id", `${id}`)
            producto.setAttribute("data-pvp", `${productosData[id].pvp}`)
            producto.classList.add("nuevo-producto-rojo")
            //producto.innerHTML = 




            info = document.createElement("div")
            info.classList.add("product-info")

            precio = document.createElement("span")
            precio.textContent= `${productosData[id].pvp}`
            precio.classList.add("product-info")
            info.appendChild(precio)

            nombre = document.createElement("span")
            nombre.textContent= `${productosData[id].info}`
            nombre.classList.add("product-name")
            info.appendChild(nombre)

            producto.appendChild(info)

            

            

            producto.addEventListener("click", function() {this.remove()} )
            productoList.appendChild(producto)
            
      })
      
    })
    .catch(error => {
        console.log("Error al recuperar el json")
        console.log( error)
       
    });



           // producto.classList.add("product-item")
           // producto.classList.add()
           // producto.add("product")