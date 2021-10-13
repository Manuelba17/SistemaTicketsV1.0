//  Invocamos a Bryptjs
const bcryptjs = require('bcryptjs');

//  Invocamos al modulo de conexion de la base de datos
const connection = require('../database/db');
const session = require('express-session');
const { render } = require('ejs');

const controller = {};

// pagina de login
controller.login = (req, res)=>{
   
    res.render('login');
};

//pagina de registro 
controller.register = (req, res)=>{
  
    res.render('register');
};

// Registro en la base de datos
controller.dbregister = async(req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const company = req.body.company;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    if(user){
        connection.query('SELECT * FROM usuarios WHERE UsUsuario = ?', [user], async(error,results)=>{
         if(results == 0){
            connection.query('INSERT INTO usuarios SET ?', {UsUsuario:user, UsNombre:name, UsPassword:passwordHaash, UsCompany:company}, async(error,results)=>{
                if(error){
                    console.log(error);
                }else
                res.render('registers');
        
            })

         } else{
            // console.log('El usuario ya existe en el sistema');
            res.render('register', {                    
                alert:true,
                alertTitle:"Opps....",
                alertMessage:"El usuario ya existe",
                alertIcon:'warning',
                ruta:'register',     
                timer:'false' ,
                showConfirmButton: true,  
          })
         }
        })
    }
    }

// Pagina de usuario registrado
controller.usuarioRegistrado =(req, res)=>{
  
    res.render('registers');
}

// Autenticacion de la pagina
controller.auth = async(req,res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

  if(user && pass){
        connection.query('SELECT * FROM usuarios WHERE UsUsuario = ?', [user], async(error,results)=>{
           if(results ==0 || !(await bcryptjs.compare(pass, results[0].UsPassword))){
                res.render('login', {                    
                    alert:true,
                    alertTitle:"Opps....",
                    alertMessage:"Usuario o password incorrecto",
                    alertIcon:'error',
                    ruta:'login',     
                    timer:'false' ,
                    showConfirmButton: true,  
              })
            }else {
                req.session.loggedin =true;
            req.session.name = results[0].UsNombre
            res.render('login', {
                alert:true,
                alertTitle:"Felicitaciones",
                alertMessage:"Usuario conectado",
                alertIcon:'success',
                ruta:'',   
                showConfirmButton: false,
                timer:  1500
                 })
                 }                        
        })
    }
}

// pagina de dashboard
controller.raiz = (req,res) =>{
    connection.query('SELECT * FROM tickets', async(error,results)=>{

    if(req.session.loggedin){
            res.render('index',{
                login:true,
                name: req.session.name,
                results:results
            });
       }else{
           res.render('index',{
               login:false,
               name: 'Usuario NO Realizo el login, por favor inicie sesion'
           })
       }
    })
}

// Logout
controller.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('login')
    })
}


// pagina de crear el ticket 
controller.create = async(req,res) =>{

    if(req.session.loggedin){
        res.render('create',{
            login:true,
            name: req.session.name,
             
        });
   }else{
       res.render('index',{
           login:false,
           name: 'Usuario NO Realizo el login, por favor inicie sesion'
       })
   }
}

// POST para guardar la informacion
controller.save = (req, res) =>{
    const data = req.body
    connection.query('INSERT INTO tickets SET ?', [data], async(error,results)=>{
        if(req.session.loggedin){          
            res.render('create', {
                login:true,
                name:req.session.name,
                alert:true,
                alertTitle:"Felicitaciones",
                alertMessage:"El ticket se a creado",
                alertIcon:'success',
                ruta:'',   
                showConfirmButton: false,
                timer:  1500
                 })
        }else{
            res.render('index',{
                login:false,
                name: 'Debe iniciar sesion'
            })
        }
   })
}

//Pagina para editar
controller.edit = (req, res) =>{
    const id = req.params.TiId

    connection.query('SELECT * FROM tickets WHERE TiId=?', [id], (error, results)=> {
        if(req.session.loggedin){
            res.render('edit',{
                login:true,
                name:req.session.name,
                user:results[0]
            });
        }else {
            res.render('edit',{
                login:false,
                name: 'Usuario NO Realizo el login, por favor inicie sesion'
            })
               
        }
    })
}

// POST para editar los datos nuevos enviados
controller.update = (req, res) =>{
    const tipo = req.body.TiTipo
    const asunto = req.body.TiAsunto
    const estado = req.body.TiEstado
    const observ = req.body.TiObservaciones
    const id = req.body.TiId
    connection.query('UPDATE tickets SET ? WHERE TiId = ?', [{TiObeservaciones:observ, TiEstado:estado}, id], async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/')
        }
   })
}

// Get para eliminar los archivos
controller.delete = (req, res) =>{
    const id = req.params.TiId;
    console.log(id);
    if(req.session.loggedin){
        connection.query('DELETE FROM tickets where TiId = ?', [id], (error, results) =>{

            if(req.session.loggedin){
                res.redirect('/')
            }
    
   else{
            res.render('index',{
                login:false,
                name: 'Usuario NO Realizo el login, por favor inicie sesion'
            })
        }
    })
}else{
    res.render('index',{
        login:false,
        name: 'Usuario NO Realizo el login, por favor inicie sesion'
    })
}
}


           
           
      


module.exports = controller;