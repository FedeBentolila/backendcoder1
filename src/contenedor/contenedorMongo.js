
import { model } from "mongoose";
import { productosmodule } from "../config.js";

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

export class ContenedorMongo {
    constructor(nombre) {
      this.nombre = nombre;
    }

    async getAllmongo() {
       const archivo = await productosmodule.find();
       return archivo
      } 

      async getByIDmongo(idabuscar) {
        try {
          let objetobuscado= await productosmodule.find({"id": {$eq: idabuscar}});
          console.log(objetobuscado)
          return objetobuscado;
          
        } catch (error) {
          console.log("error al buscar el id"+ error);
        }
      }

      async saveMongo(objeto){
        const archivo = await productosmodule.find();
        let id = 1;
        archivo.forEach((element, index) => {
        if (element.id >= id) {
        id = element.id + 1;
          }
        });
        objeto.id = id;
        objeto.timestamp= dateStr
        let productosSaveModel= new productosmodule(objeto)
        await productosSaveModel.save()
      }


      async updateMongo(id, objeto){
        objeto.timestamp= dateStr;
        
        await productosmodule.updateOne({"id":{$eq:id}},{$set:{
          "title":objeto.title, 
          "price":objeto.price, 
          "thumbnail":objeto.thumbnail,
          "code":objeto.code,
          "stock":objeto.stock,
          "description":objeto.description,
          "timestamp":objeto.timestamp,

        }})
      }

      async deletemongo(id){
        await productosmodule.deleteOne({"id":{$eq:id}})
      }
}







    
