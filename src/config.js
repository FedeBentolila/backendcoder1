import mongoose from "mongoose";

const productosCollection= 'productos';
const Schema= mongoose.Schema;

const productosSchema= new Schema({
    title:{type: String},
    description:{type: String},
    price:{type: Number},
    code:{type: Number},
    stock:{type: Number},
    thumbnail:{type: String},
    timestamp:{type: String},
    id:{type: Number},
})

export const productosmodule= mongoose.model(productosCollection, productosSchema);

export async function ConexionMongo() {
    
        mongoose.connect('mongodb+srv://root:root@cluster0.wsvmh2e.mongodb.net/ecommerce?retryWrites=true&w=majority',{
            useNewUrlparser: true,
            useUnifiedTopology: true,
        });
        console.log('ok conexion')
    
}