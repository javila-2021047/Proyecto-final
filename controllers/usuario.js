const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const postUsuarioClient = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const guardadoDB = new Usuario({ nombre, correo, password,rol:"ROL_CLIENTE" });

    const salt = bcrypt.genSaltSync();
    guardadoDB.password = bcrypt.hashSync(password, salt);

    await guardadoDB.save();

    res.json({
        msg: 'Agregago Exitosamente',
        guardadoDB
    });

}
const postUsuarioAdmin = async (req = request, res = response) => {

    
    const { nombre, correo, password } = req.body;
    const guardadoDB = new Usuario({ nombre, correo, password,rol:"ROL_ADMIN" });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    guardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await guardadoDB.save();

    res.json({
        msg: 'Agregago Exitosamente',
        guardadoDB
    });

}


const putUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, img,  estado, google, ...resto } = req.body;
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteUsuario = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

     const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    postUsuarioClient,
    postUsuarioAdmin,
    putUsuario,
    deleteUsuario
}


// CONTROLADOR