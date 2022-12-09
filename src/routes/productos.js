import express from 'express';
import { Contenedor } from '../contenedor/contenedorFs.js';

const { Router } = express;
const rutaProducto = Router();

const admin= true;

const productos = new Contenedor('src/db/productos.json');


function middleware(peticion, respuesta, next){
  if (admin==true){
    next()
  }else{
    respuesta.status(403).send({error: -1, descripcion:'ruta no autorizada'})
  }
}


//Endpoints

rutaProducto.get("/", (peticion, respuesta) => {
  respuesta.render("formulario", {});
}); 

rutaProducto.get("/productos", (peticion, respuesta) => {
   productos.getAll().then((res) => {
    respuesta.json(res);
  });
});


rutaProducto.get('/productos/:id', (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);
  productos.getByID(id).then((res) => {
    respuesta.json(res);
  });
}); 

rutaProducto.post('/productos', middleware, (peticion, respuesta) => {
  const producto = peticion.body;
  productos.Save(producto).then(() => {
    respuesta.render("formulario", {});
  });
  
});

rutaProducto.put('/productos/:id', middleware, async (peticion, respuesta) => {
  const idProducto = parseInt(peticion.params.id);
  const producto = peticion.body;
  await productos.update(idProducto, producto);
  respuesta.json(producto);
}); 

 rutaProducto.delete('/productos/:id', middleware, (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);
  productos.deleteById(id).then((res) => {
    respuesta.json("producto eliminado");
  });
  
}); 

export { rutaProducto };