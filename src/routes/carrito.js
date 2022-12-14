import express from 'express';
import ContenedorCarrito from '../daos/carrito/carritoDaoFs.js'
import ContenedorProductos from '../daos/productos/productosDaoFs.js'

import ContenedorCarritosMongo from '../daos/carrito/carritoDaoMongo.js';
import ContenedorProductosMongo from '../daos/productos/productosDaoMongo.js'

import ContenedorCarritosFb from '../daos/carrito/carritoDaoFb.js';
import ContenedorProductosFb from '../daos/productos/productosDaoFb.js'

const rutaCarrito = express.Router();

const carritos = new ContenedorCarrito();
const productos = new ContenedorProductos();

let productosdeMongo= new ContenedorProductosMongo();
let carritosdeMongo= new ContenedorCarritosMongo();

let productosdeFB= new ContenedorProductosFb();
let carritosdeFB= new ContenedorCarritosFb();

let date = new Date();
let dateStr =
  ("00" + date.getDate()).slice(-2) +
  "/" +
  ("00" + (date.getMonth() + 1)).slice(-2) +
  "/" +
  date.getFullYear() +
  " " +
  ("00" + date.getHours()).slice(-2) +
  ":" +
  ("00" + date.getMinutes()).slice(-2) +
  ":" +
  ("00" + date.getSeconds()).slice(-2);


//Endpoints

rutaCarrito.get('/carrito', async (peticion, respuesta) => {
  
  const listacarritomongo= await carritosdeMongo.getAllcarritosMongo();
  console.log(listacarritomongo)
  
  const listaCarritos = await carritos.getAll();
  respuesta.json(listaCarritos);

  carritosdeFB.getAllfbcarritos().then((res)=>{
    console.log(res)
   respuesta.json(res)
 }) 

});


rutaCarrito.delete('/carrito/:id', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);
  await carritos.deleteById(idCarrito);

  await carritosdeMongo.deletecarritosmongo(idCarrito)
  respuesta.json({
    status: 'ok'
  }); 

  carritosdeFB.deleteFBcarrito(idCarrito)

});

rutaCarrito.get('/carrito/:id/productos', async (peticion, respuesta) => {
  const idCarrito = parseInt(peticion.params.id);

  const res= await carritosdeMongo.getByIDcarritosmongo(idCarrito)
  console.log(res[0].productos) 

  
  carritos.getByID(idCarrito).then((res)=>{
    respuesta.json(res.productos);
  })  

  carritosdeFB.getByIdFbcarritos(idCarrito).then((res)=>{
    console.log(res.productos);
  })  

});


rutaCarrito.post('/carrito', async (peticion, respuesta) => {
  const carrito = {
    productos: []
  };

  carritosdeMongo.saveMongoCarrito(carrito)

  carritosdeFB.saveCarritoFb(carrito)


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

  productosdeFB.getByIdFb(idProducto).then((res)=>{
    carritosdeFB.getByIdFbcarritos(idCarrito).then((res2)=>{
      res2.productos.push(res);

       carritosdeFB.updateCarritoFb(idCarrito,res2)
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

  carritosdeFB.getByIdFbcarritos(idCarrito).then((res)=>{
    let arreglo= res.productos;
    let indexToDelete
    arreglo.forEach((element, index ) => {
      if (element.id==idProducto) {
        indexToDelete= index
      }});

      arreglo.splice(indexToDelete, 1);
      let objeto={
        productos: arreglo,
        id:idCarrito,
        timestamp:dateStr
      }
      
      carritosdeFB.deleteFBcarrito(idCarrito).then(()=>{
        carritosdeFB.saveCarritoFbparadeletedeproductos(objeto)
      })

  })


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