import express from 'express';

import Contenedor from '../daos/productos/productosDaoFs.js';
import  ContenedorMongo  from '../daos/productos/productosDaoMongo.js'


let productosdeMongo= new ContenedorMongo();


const { Router } = express;
const rutaProducto = Router();

const admin= true;

const productos = new Contenedor();


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
  
  productosdeMongo.getAllmongo().then((res)=>{
     console.log(res)
    //respuesta.json(res)
  }) 

   productos.getAll().then((res) => {
    respuesta.json(res);
  }); 


});


rutaProducto.get('/productos/:id', (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);

  productosdeMongo.getByIDmongo(id).then((res)=>{
    console.log(res)
    //respuesta.json(res)
  })

  productos.getByID(id).then((res) => {
    respuesta.json(res);
  });

  

}); 

rutaProducto.post('/productos', middleware, (peticion, respuesta) => {
  const producto = peticion.body;

  productosdeMongo.saveMongo(producto).then(() => {
    // respuesta.render("formulario", {});
   });

 productos.Save(producto).then(() => {
    respuesta.render("formulario", {});
  });

  
  
});



rutaProducto.put('/productos/:id', middleware, async (peticion, respuesta) => {
  const idProducto = parseInt(peticion.params.id);
  const producto = peticion.body;

  await productos.update(idProducto, producto);

  productosdeMongo.updateMongo(idProducto, producto)

  respuesta.send("ok");
}); 

 rutaProducto.delete('/productos/:id', middleware, (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);

  productosdeMongo.deletemongo(id).then(() => {
    //respuesta.json("producto eliminado");
  });

   productos.deleteById(id).then((res) => {
    respuesta.json("producto eliminado");
  }); 
  
}); 

export { rutaProducto };