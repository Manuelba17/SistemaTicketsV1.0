// Invocar al modulo que permite la conexión a base de datos
const mysql = require('mysql');


const connection = mysql.createConnection({

        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
}); 

connection.connect((error)=>{
 
    if(error){
        console.log('Error en la conexión es :'+error)
        return;
    }
    console.log('Conexion establecida con la base de datos: ' +process.env.DB_DATABASE)
});

module.exports = connection;