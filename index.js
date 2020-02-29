// Importa packages

const fs = require('fs');
const colors = require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const secretsContents = fs.readFileSync('secrets.json');
const secrets = JSON.parse(secretsContents);

// Server: 

const server = express();


// Middlewares: 

server.use(bodyParser.json());
server.use(cookieParser());

// Enpoints: 

server.post("/register", (req, res) => {
    fs.readFile('users.json', (err, fileContents) => {
        if (err) throw err;
        const data = JSON.parse(fileContents);
        /* Teniendo un array, comprobar si alguno de los objetos que tengo dentro
        tengo una clave username igual que la que me estan danddo */

        for (let i = 0; i < data.length; i++) {
            if (data[i]['email'] === req.body['email']) {
                // Si entro en esta linea significa que existe el usuario
                res.send({
                    "message": "El usuario ya existe"
                })
                return;
            }
        } // No se ha encontrado un usuario repetido.

        bcrypt.hash(
            req.body.password,
            14,
            (err, hash) => {
                if (err) throw err;
                const dataUser = {
                    "username": req.body.username,
                    "email": req.body.email,
                    "password": hash
                }
                // Añado al array de usuarios el nuevo usuario: 
                data.push(dataUser)
                fs.writeFile(
                    'users.json',
                    JSON.stringify(data, null, 4),
                    (error) => {
                        if (error) throw error;
                        res.send({
                            "message": "Usuario creado con exito!"
                        })
                    }
                )
            }
        )
    })
    if (req.body.username && req.body.password) {

    } else {
        res.send({
            "message": "Body mal construido"
        })

    }
})

server.post("/login", (req, res) => {

    if (req.body.username && req.body.password && req.body.email) {
        const dataUser = {
            "username": req.body.username,
            "email": req.body.email,
            "password": req.body.password
        }
        fs.readFile('users.json', (err, fileContents) => {
            if (err) throw err;
            const data = JSON.parse(fileContents);

            for (let i = 0; i < data.length; i++) {
                if (data[i]['email'] === req.body['email']) {

                    bcrypt.compare(
                        dataUser["password"],
                        data[i]["password"],
                        (error, rest) => {
                            if (error) throw error;
                            if (dataUser["email"] == data[i]["email"] && rest) {
                                jwt.sign({
                                        "email": dataUser['email']
                                    },
                                    secrets["jwt_clave"],
                                    (err, token) => {
                                        if (err) throw err;
                                        res.cookie('sello', token);
                                        res.send({
                                            "message": "Usuario loggeado",
                                            "token": token
                                        })
                                    })
                            } else {
                                res.send({
                                    "message": "Usuario o contraseña incorrectos"
                                })
                            }
                        }
                    )
                    return
                } else {
                    if (i === data.length - 1) {
                        res.send({
                            "message": "Usuario no existe!"
                        })
                        return;
                    }
                }
            }
        })
    } else {
        res.send({
            "message": "Has construido mal el body"
        })
    }
})


server.get("/pedidos", (req, resp) => {

    fs.readFile(
        'datos.json',
        (err, fileContents) => {
            if (err) throw err;
            const data = JSON.parse(fileContents)
            resp.send(data)
        }
    )
})

server.get("/pedido/:indice", (req, resp) => {

    fs.readFile(
        'datos.json',
        (err, fileContents) => {
            if (err) throw err;
            const data = JSON.parse(fileContents)
            const pedido = data[req.params.indice]
            resp.send(pedido)
        }
    )
})


server.post("/crearPedido", (req, resp) => {
    if ((req.body.productos && req.body.fecha && req.body.direccion && req.body.precio)){

    
        fs.readFile('datos.json', (err, fileContents) => {
            if (err) throw err;
            const data = JSON.parse(fileContents);
            let id = 0;
            for (const order of data) {
                if (order["id"] > id) {
                    id = order["id"]
                }
                id ++;
            }

            let newPedido = {
                productos: [req.body.productos],
                fecha: req.body['fecha'],
                direccion: req.body['direccion'],
                precio: req.body['precio'],
                id: id ++
            }
            data.push(newPedido)

            fs.writeFile(
                'datos.json',
                JSON.stringify(data, null, 4),
                (err) => {
                    if (err) throw err;
                    resp.send({
                        "message": "Pedido recibido"
                    });
                })
        })
    } else {

        resp.send({"message": "¿Ha habido un problema al construir el body?"})
    }
    
})

server.put("/editarPedido", (req, resp) => {
    fs.readFile('datos.json', (err, fileContents) => {
        if (err){
            resp.send({"message": "Ha habido un error"});
            throw err;
        } 

        let data = JSON.parse(fileContents)
        if (req.body.productos && req.body.fecha && req.body.direccion && req.body.precio && !isNaN(req.body.id)) {

            let id = data.map(
                    function (e) {
                        return parseInt(e.id)
                    })
                .indexOf(parseInt(req.body.id));
                    
            if (id !== -1) {
                let nuevoPedido = {
                    productos: req.body.productos,
                    fecha: req.body.fecha,
                    direccion: req.body.direccion,
                    precio: req.body.precio,
                    id: req.body.id
                };
            data.splice(id, 1, nuevoPedido);
    
            fs.writeFile(
                'datos.json',
                JSON.stringify(data, null, 4),
                (err) => {
                    if (err) throw err;
                    resp.send({
                        "message": "Pedido modificado con exito"
                    });
                });
            }
        } else {
            resp.send({"message": "ups! ha habido un problema"})
        }
    })
})

server.delete("/eliminarPedido/:id", (req, resp) => {
    if (!isNaN(req.params.id)){
        fs.readFile(
            'datos.json', 
            (err, fileContents) => {
                if (err) {
                resp.send({"Message": "Ups! ha habido un problema"});
                throw err;
            }
            let data = JSON.parse(fileContents);

            let elementIndex = data.map(function(e) { return e.id; }).indexOf(parseInt(req.params.id));

            if (elementIndex === -1){
                resp.send({"Status": "Error", "Message": "Ese ID ya no existe en esta base de datos."});
            } else {
                data.splice(elementIndex, 1)
                fs.writeFile(
                    'datos.json', 
                    JSON.stringify(data, null, 4), 
                    (err) => {
                        if (err) {
                        resp.send({"Message": "Error al escribir los datos"});
                        throw err;
                    }
                    resp.send({"Message": "Pedido eliminado con éxito."});
                })
            }
        })
    } else {
        resp.send({"Message": "No has mandado bien el path param"})
    }
})



// Ports: 

server.listen(3000, () => {
    console.log("Servirdor escuchando el puerto 3000".america)
})