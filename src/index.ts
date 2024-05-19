import server from "./server";
import color from "colors"
//Definicion del puerto

const port = process.env.PORT  || 4000;

server.listen(port, ()=>{
    console.log(color.bgCyan.white.bold(`Rest api funcionando en el puerto ${port}`))
})
