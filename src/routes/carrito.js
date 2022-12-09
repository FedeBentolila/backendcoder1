import express from 'express';
import { Contenedor } from '../contenedor/contenedorFs.js';
const rutaCarrito = express.Router();

const carritos = new Contenedor('src/db/carritos.json');
const productos = new Contenedor('src/db/productos.json');


//Endpoints

rutaCarrito.get('/carrito', async (peticion, respuesta) => {
  const listaCarritos = await carritos.getAll();
  respuesta.json(listaCarritos);

});

rutaCarrito.delete('/carrito/:id', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  await carritos.deleteById(idCarrito);
  respuesta.json({
    status: 'ok'
  });
});

rutaCarrito.get('/carrito/:id/productos', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  carritos.getByID(idCarrito).then((res)=>{
    respuesta.json(res.productos);
  })  
});

rutaCarrito.post('/carrito', async (peticion, respuesta) => {
  const carrito = {
    productos: []
  };
  carritos.Save(carrito).then((res)=>{
    respuesta.json(res);
  })  
});

rutaCarrito.post('/carrito/:id/productos/:id_prod', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  const idProducto =parseInt(peticion.params.id_prod) ;
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