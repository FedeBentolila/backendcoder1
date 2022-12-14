import express from "express";

import { rutaProducto } from "./routes/productos.js";
import { rutaCarrito } from "./routes/carrito.js";

import { ConexionMongo } from "./config.js";

import { ConexionFb } from "./config.js";

const aplicacion = express();

const PUERTO = 8080;

aplicacion.set("view engine", "ejs");

aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

aplicacion.use("/api/", rutaProducto);
aplicacion.use("/api/", rutaCarrito);

const conexionServidor = aplicacion.listen(PUERTO, () => {
  console.log(
    `Aplicación escuchando en el puerto: ${conexionServidor.address().port}`
  );
});

conexionServidor.on("error", (error) =>
  console.log(`Ha ocurrido un error: ${error}`)
);

ConexionMongo();
