import express from 'express';
import ContenedorCarrito from '../daos/carrito/carritoDaoFs.js'
import ContenedorProductos from '../daos/productos/productosDaoFs.js'

import ContenedorCarritosMongo from '../daos/carrito/carritoDaoMongo.js';
import ContenedorProductosMongo from '../daos/productos/productosDaoMongo.js'


// import { Contenedor } from '../contenedor/contenedorFs.js';
const rutaCarrito = express.Router();

const carritos = new ContenedorCarrito();
const productos = new ContenedorProductos();

let productosdeMongo= new ContenedorProductosMongo();
let carritosdeMongo= new ContenedorCarritosMongo();


//Endpoints

rutaCarrito.get('/carrito', async (peticion, respuesta) => {
  
  const listacarritomongo= await carritosdeMongo.getAllcarritosMongo();
  console.log(listacarritomongo)
  
  const listaCarritos = await carritos.getAll();
  respuesta.json(listaCarritos);

});


rutaCarrito.delete('/carrito/:id', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  await carritos.deleteById(idCarrito);

  await carritosdeMongo.deletecarritosmongo(idCarrito)
  respuesta.json({
    status: 'ok'
  });
});

rutaCarrito.get('/carrito/:id/productos', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);

  const res= await carritosdeMongo.getByIDcarritosmongo(idCarrito)
  console.log(res[0].productos)

  
  carritos.getByID(idCarrito).then((res)=>{
    respuesta.json(res.productos);
  })  
});



rutaCarrito.post('/carrito', async (peticion, respuesta) => {
  const carrito = {
    productos: []
  };

  carritosdeMongo.saveMongoCarrito(carrito)


  carritos.Save(carrito).then((res)=>{
    respuesta.json(res);
  })  
});


rutaCarrito.post('/carrito/:id/productos/:id_prod', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  const idProducto =parseInt(peticion.params.id_prod) ;

  productosdeMongo.getByIDmongo(idProducto).then((res)=>{
    carritosdeMongo.getByIDcarritosmongo(idCarrito).then((res2)=>{
      res2[0].productos.push(res[0]);

      carritosdeMongo.updateMongoCarritos(idCarrito,res2[0].productos)
    })

  })


  productos.getByID(idProducto).then((res)=>{
    carritos.getByID(idCarrito).then((res2)=>{
      res2.productos.push(res);
      carritos.update(idCarrito, res2)
    })   
  })  

  respuesta.json({
    status: 'ok'
  });
});


rutaCarrito.delete('/carrito/:id/productos/:id_prod', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  const idProducto = parseInt(peticion.params.id_prod);

  await carritosdeMongo.deleteproductosdecarrito(idCarrito, idProducto)


  const carrito = await carritos.getByID(idCarrito);
  let indexToDelete = -1;
  carrito.productos.forEach((producto, index) => {
    if (producto.id == idProducto) {
      indexToDelete = index;
    }
  });
  if (indexToDelete => 0) {
    carrito.productos.splice(indexToDelete, 1);
  }
  await carritos.update(idCarrito, carrito);
  respuesta.json({
    status: 'ok'
  });
});


export { rutaCarrito };